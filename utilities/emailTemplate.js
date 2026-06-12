// utils/emailTemplate.js
const dailyTaskTemplate = (tasks, userName) => {
  const taskRows = tasks.map(task => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee">${task.subject}</td>
      <td style="padding:10px;border-bottom:1px solid #eee">${task.title}</td>
      <td style="padding:10px;border-bottom:1px solid #eee">
        <span style="
          background:${task.priority === 'high' ? '#fee2e2' : '#fef9c3'};
          color:${task.priority === 'high' ? '#dc2626' : '#ca8a04'};
          padding:2px 8px;border-radius:99px;font-size:12px
        ">${task.priority || 'normal'}</span>
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
      <h2 style="color:#4f46e5">📚 Good Morning, ${userName}!</h2>
      <p style="color:#555">Here are your study tasks for <strong>${new Date().toDateString()}</strong>:</p>

      ${tasks.length === 0 ? `
        <p style="color:#888">No tasks scheduled for today. Add some from your dashboard!</p>
      ` : `
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:10px;text-align:left;color:#374151">Subject</th>
              <th style="padding:10px;text-align:left;color:#374151">Task</th>
              <th style="padding:10px;text-align:left;color:#374151">Priority</th>
            </tr>
          </thead>
          <tbody>${taskRows}</tbody>
        </table>
      `}

      <p style="margin-top:32px;color:#888;font-size:12px">
        Sent by PlanMyExam · Stay consistent 💪
      </p>
    </div>
  `;
};

module.exports = { dailyTaskTemplate };