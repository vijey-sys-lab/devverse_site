document.addEventListener('DOMContentLoaded', () => {
  const coursesList = document.getElementById('courses-list');
  const registerForm = document.getElementById('register-form');
  const registerMsg = document.getElementById('register-msg');
  const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
  const btnRegister = document.getElementById('btn-register');

  // Open modal
  btnRegister.addEventListener('click', () => registerModal.show());

  // Load courses
  async function loadCourses() {
    try {
      const res = await fetch('/api/courses');
      const courses = await res.json();
      coursesList.innerHTML = courses.map(c => `
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 course-card p-3">
            <h5 class="fw-bold">${escapeHtml(c.title)}</h5>
            <p class="text-muted small">${escapeHtml(c.short)}</p>
            <p><span class="badge bg-primary">${escapeHtml(c.level)}</span>
            <span class="badge bg-success">${escapeHtml(c.price)}</span></p>
          </div>
        </div>
      `).join('');
    } catch {
      coursesList.innerHTML = `<p class="text-danger">Unable to load courses.</p>`;
    }
  }

  // Register
  registerForm.addEventListener('submit', async ev => {
    ev.preventDefault();
    registerMsg.textContent = 'Registering...';
    const fd = new FormData(registerForm);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      registerMsg.textContent = '🎉 Registered successfully!';
      registerForm.reset();
    } catch (err) {
      registerMsg.textContent = '❌ ' + err.message;
    }
  });

  function escapeHtml(s){return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]))}

  loadCourses();
});
