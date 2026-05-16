//renderer.js
document.addEventListener('DOMContentLoaded', () => {
  const tabBar = document.getElementById('tab-bar');
  const subTabs = document.getElementById('sub-tabs');
  const noteArea = document.getElementById('note-area');
  const addSubBtn = document.getElementById('add-sub-tab');
  const modal = document.getElementById('input-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalInput = document.getElementById('modal-input');
  const modalConfirm = document.getElementById('modal-confirm');
  const modalDelete = document.getElementById('modal-delete');
  const modalCancel = document.getElementById('modal-cancel');

  const minBtn = document.getElementById('min-btn');
  const maxBtn = document.getElementById('max-btn');
  const closeBtn = document.getElementById('close-btn');

  let currentMain = null;
  let currentSub = null;
  let data = window.api.loadData();

  function save() {
    window.api.saveData(data);
  }

  function renderTabs() {
    tabBar.innerHTML = '';
    Object.keys(data).forEach(main => {
      const tab = document.createElement('div');
      tab.className = 'tab';
      tab.textContent = main;
      if (main === currentMain) tab.classList.add('active');
      tab.onclick = () => {
        currentMain = main;
        currentSub = null;
        renderTabs();
        renderSubTabs();
        noteArea.value = '';
        noteArea.placeholder = '請選擇子分類...';
      };
      tabBar.appendChild(tab);
    });

    const addTab = document.createElement('button');
    addTab.id = 'add-tab';
    addTab.className = 'add-tab-btn';
    addTab.textContent = '＋';
    addTab.onclick = () => openModal('新增主分類');
    tabBar.appendChild(addTab);
  }

  function renderSubTabs() {
    subTabs.innerHTML = '';
    if (!currentMain || !data[currentMain]) return;
    Object.keys(data[currentMain]).forEach(sub => {
      const btn = document.createElement('button');
      btn.textContent = sub;
      btn.className = 'sub-tab';
      if (sub === currentSub) btn.classList.add('active');
      btn.onclick = () => {
        currentSub = sub;
        noteArea.value = data[currentMain][sub] || '';
        noteArea.placeholder = '';
        renderSubTabs();
      };
      subTabs.appendChild(btn);
    });
  }

  addSubBtn.addEventListener('click', () => {
    if (!currentMain) return alert('請先選擇主分類！');
    openModal('新增子分類');
  });

  noteArea.addEventListener('input', () => {
    if (currentMain && currentSub) {
      data[currentMain][currentSub] = noteArea.value;
      save();
    }
  });

  function openModal(title) {
    modal.classList.remove('hidden');
    modalTitle.textContent = title;
    modalInput.value = '';
    modalInput.focus();

    modalConfirm.onclick = () => {
      const name = modalInput.value.trim();
      if (!name) return;
      if (title.includes('主')) {
        if (!data[name]) {
          data[name] = {};
          currentMain = name;
          currentSub = null;
          renderTabs();
          renderSubTabs();
          save();
        }
      } else {
        if (!data[currentMain][name]) {
          data[currentMain][name] = '';
          currentSub = name;
          renderSubTabs();
          save();
        }
      }
      modal.classList.add('hidden');
    };

    modalCancel.onclick = () => modal.classList.add('hidden');

    modalDelete.onclick = () => {
      if (title.includes('主')) {
        delete data[currentMain];
        currentMain = null;
        currentSub = null;
      } else if (currentSub) {
        delete data[currentMain][currentSub];
        currentSub = null;
      }
      modal.classList.add('hidden');
      renderTabs();
      renderSubTabs();
      noteArea.value = '';
      noteArea.placeholder = '請選擇子分類...';
      save();
    };
  }

  // 綁定視窗控制按鈕
  minBtn.onclick = () => window.api.minimize();
  maxBtn.onclick = () => window.api.maximize();
  closeBtn.onclick = () => window.api.close();

  renderTabs();
  renderSubTabs();
});
