const Poll = require('../models/Poll');

module.exports = function registerPollSocket(io) {
      const connectedStudents = new Map();
      let activePoll = null;
      let pollTimer = null;

      (async () => {
            try {
                  const dbActive = await Poll.findOne({ isActive: true });
                  if (dbActive) {
                        activePoll = dbActive;
                        console.log('Restored active poll from DB:', activePoll._id);
                  }
            } catch (err) {
                  console.error('Error restoring active poll:', err);
            }
      })();

      function broadcastStudents() {
            io.emit('update_students', Array.from(connectedStudents.values()));
      }

      async function endActivePoll(reason = 'ended_by_teacher') {
            if (!activePoll) return;
            console.log('🛑 Ending poll with reason:', reason);

            // mark unanswered students as No Answer
            const studentIds = Array.from(connectedStudents.keys());
            const answeredIds = new Set((activePoll.answers || []).map(a => a.studentId));
            let noAnswerCount = activePoll.noAnswerCount || 0;
            for (const sid of studentIds) {
                  if (!answeredIds.has(sid)) {
                        activePoll.answers.push({ studentId: sid, name: connectedStudents.get(sid)?.name || 'Unknown', optionIndex: -1 });
                        noAnswerCount += 1;
                  }
            }
            activePoll.noAnswerCount = noAnswerCount;
            activePoll.isActive = false;

            console.log('💾 Saving final poll state to database');
            await activePoll.save();
            console.log('✅ Poll ended and saved with answers:', activePoll.answers.length);

            io.emit('update_results', activePoll);
            io.emit('poll_end', { pollId: activePoll._id, reason });
            activePoll = null;
            if (pollTimer) {
                  clearTimeout(pollTimer);
                  pollTimer = null;
            }
      }

      io.on('connection', (socket) => {
            console.log('socket connected', socket.id);

            socket.on('student_join', ({ name }) => {
                  connectedStudents.set(socket.id, { id: socket.id, name });
                  broadcastStudents();
                  if (activePoll) socket.emit('update_results', activePoll);
            });

            socket.on('disconnect', () => {
                  if (connectedStudents.has(socket.id)) {
                        connectedStudents.delete(socket.id);
                        broadcastStudents();
                  }
            });

            socket.on('teacher_create_poll', async (data, cb) => {
                  try {
                        if (activePoll && activePoll.isActive) return cb && cb({ error: 'Active poll already running' });

                        await Poll.updateMany({ isActive: true }, { isActive: false });

                        const pollDoc = new Poll({
                              question: data.question,
                              options: data.options.map(text => ({ text, votes: 0 })),
                              timeLimit: data.timeLimit || 60,
                              isActive: true,
                              totalVotes: 0,
                              noAnswerCount: 0,
                              answers: [],
                              allowedVoters: Array.from(connectedStudents.keys()),
                              teacherName: data.teacherName || 'Unknown Teacher'
                        });

                        await pollDoc.save();
                        activePoll = pollDoc;

                        io.emit('update_results', activePoll);

                        if (pollTimer) clearTimeout(pollTimer);
                        pollTimer = setTimeout(async () => {
                              await endActivePoll('timeout');
                        }, (pollDoc.timeLimit || 60) * 1000);

                        cb && cb({ success: true, poll: pollDoc });
                  } catch (err) {
                        console.error('Error in teacher_create_poll:', err);
                        cb && cb({ error: 'Server error' });
                  }
            });

            socket.on('teacher_new_question', async (data, cb) => {
                  try {
                        if (activePoll && activePoll.isActive) {
                              const allowedVoters = activePoll.allowedVoters || [];
                              const answeredVoters = new Set((activePoll.answers || []).map(a => a.studentId));
                              const pendingVoters = allowedVoters.filter(id => !answeredVoters.has(id));

                              if (pendingVoters.length > 0) {
                                    return cb && cb({ error: `Waiting for ${pendingVoters.length} student(s) to answer.` });
                              }
                        }
                        socket.emit('teacher_create_poll', data, cb);
                  } catch (err) {
                        console.error(err);
                        cb && cb({ error: 'Server error' });
                  }
            });

            socket.on('student_answer', async ({ pollId, optionIndex }, cb) => {
                  try {
                        if (!activePoll || !activePoll.isActive || String(activePoll._id) !== String(pollId)) {
                              return cb && cb({ error: 'No active poll or poll mismatch' });
                        }

                        const already = (activePoll.answers || []).some(a => a.studentId === socket.id);
                        if (already) return cb && cb({ error: 'Already answered' });

                        activePoll.answers.push({ studentId: socket.id, name: connectedStudents.get(socket.id)?.name || 'Unknown', optionIndex });
                        if (optionIndex >= 0 && activePoll.options[optionIndex]) {
                              activePoll.options[optionIndex].votes += 1;
                              activePoll.totalVotes = (activePoll.totalVotes || 0) + 1;
                        } else {
                              activePoll.noAnswerCount = (activePoll.noAnswerCount || 0) + 1;
                        }

                        await activePoll.save();
                        io.emit('update_results', activePoll);

                        const answeredCount = activePoll.answers.length;
                        if (answeredCount >= connectedStudents.size && connectedStudents.size > 0) {
                              await endActivePoll('all_answered');
                        }

                        cb && cb({ success: true });
                  } catch (err) {
                        console.error(err);
                        cb && cb({ error: 'Server error' });
                  }
            });

            // teacher can end poll manually
            socket.on('poll_end', async ({ pollId }, cb) => {
                  try {
                        if (!activePoll) return cb && cb({ error: 'No active poll' });
                        await endActivePoll('ended_by_teacher');
                        cb && cb({ success: true });
                  } catch (err) {
                        console.error(err);
                        cb && cb({ error: 'Server error' });
                  }
            });

            // small chat passthrough
            socket.on('send_message', (message) => {
                  io.emit('receive_message', message);
            });

            // kick a student (bonus)
            socket.on('kick_student', (studentSocketId) => {
                  io.to(studentSocketId).emit('kicked');
                  const target = io.sockets.sockets.get(studentSocketId);
                  if (target) target.disconnect(true);
                  connectedStudents.delete(studentSocketId);
                  broadcastStudents();
            });

            // client may request current active poll
            socket.on('request_active_poll', async (cb) => {
                  if (activePoll) return socket.emit('update_results', activePoll);
                  const dbActive = await Poll.findOne({ isActive: true });
                  if (dbActive) {
                        activePoll = dbActive;
                        socket.emit('update_results', activePoll);
                  } else {
                        socket.emit('update_results', null);
                  }
            });
      });
};
