function toast(msg, isError){
  let el = document.getElementById('__toast');
  if(!el){
    el = document.createElement('div');
    el.id = '__toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.borderColor = isError ? '#ff6e8e' : '';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
}

async function api(path, opts = {}){
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  const data = await res.json().catch(() => ({}));
  if(!res.ok){
    throw new Error(data.message || 'Error de red');
  }
  return data;
}