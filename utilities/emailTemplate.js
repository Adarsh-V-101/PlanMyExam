// utils/emailTemplate.js
const dailyTaskTemplate = (tasks, username) => {
  // group tasks by subject for cleaner email layout
  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.subject]) acc[task.subject] = [];
    console.log(task.subject) // for debugging
    acc[task.subject].push(task);
    return acc;
  }, {});

  const subjectBlocks = Object.entries(grouped).map(([subject, tasks]) => {
    const taskRows = tasks.map(t => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee">${t.title}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;color:#4f46e5">⏱ ${t.duration}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;color:#888">Day ${t.dayNumber}</td>
      </tr>
    `).join('');

    return `
      <h3 style="color:#374151;margin-top:24px">${subject}</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f3f4f6">
            <th style="padding:10px;text-align:left;color:#6b7280">Task</th>
            <th style="padding:10px;text-align:left;color:#6b7280">Duration</th>
            <th style="padding:10px;text-align:left;color:#6b7280">Day</th>
          </tr>
        </thead>
        <tbody>${taskRows}</tbody>
      </table>
    `;
  }).join('');

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">

      <div style="background:#4f46e5;padding:24px;border-radius:12px;margin-bottom:24px">
        <h2 style="color:white;margin:0">📚 Good Morning, ${username}!</h2>
        <p style="color:#c7d2fe;margin:8px 0 0">
          ${new Date().toDateString()} · PlanMyExam Daily Digest
        </p>
      </div>

      ${subjectBlocks}

      <div style="margin-top:32px;padding:16px;background:#f0fdf4;border-radius:8px">
        <p style="color:#16a34a;margin:0">💪 Stay consistent — small daily progress compounds fast!</p>
      </div>

      <p style="color:#aaa;font-size:12px;margin-top:24px">
        PlanMyExam · You're receiving this because you have an active study plan.
      </p>
    </div>
  `;
};

module.exports = { dailyTaskTemplate };