// Simple frontend logic: load courses; register via API
document.addEventListener('DOMContentLoaded', () => {
  const coursesList = document.getElementById('courses-list');
  const modal = document.getElementById('modal');
  const btnRegister = document.getElementById('btn-register');
  const closeModal = document.getElementById('close-modal');
  const registerForm = document.getElementById('register-form');
  const registerMsg = document.getElementById('register-msg');

  async function loadCourses() {
    try {
      const res = await fetch('/api/courses');
      const courses = await res.json();
      coursesList.innerHTML = courses.map(c => `
        <div class="course-card">
          <h4>${escapeHtml(c.title)}</h4>
          <p class="small">${escapeHtml(c.short)}</p>
          <p><strong>${escapeHtml(c.level)}</strong> • ${escapeHtml(c.price)}</p>
        </div>
      `).join('');
    } catch (e) {
      coursesList.innerHTML = '<p class="small">Unable to load courses.</p>';
    }
  }

  btnRegister.addEventListener('click', ()=> modal.classList.remove('hidden'));
  closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));

  registerForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    registerMsg.textContent = 'Registering...';

    const fd = new FormData(registerForm);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      password: fd.get('password')
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      registerMsg.textContent = 'Registered successfully! You can now close this dialog.';
      registerForm.reset();
    } catch (err) {
      registerMsg.textContent = 'Error: ' + err.message;
    }
  });

  // small escape
  function escapeHtml(s){ return String(s || '').replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m]) }

  loadCourses();
});
