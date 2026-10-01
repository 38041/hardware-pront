/**
 * ============================================================================
 * Mini Sistema de Gerenciamento de Hardware - Frontend Logic
 * JavaScript Puro (Vanilla ES6+)
 * ============================================================================
 */

// 1. Configuração Centralizada da API
// Permite ajuste fácil para deploy em produção (ex: Vercel) ou ambiente local
const API_CONFIG = {
  // Altere aqui para a URL pública caso publicado na Vercel (ex: 'https://seu-backend.vercel.app/api/hardware')
  BASE_URL: window.__API_URL__ || 'http://localhost:3000/api/hardware',
  HEALTH_URL: window.__HEALTH_URL__ || 'http://localhost:3000/',
};

// 2. Estado Global da Aplicação
const state = {
  hardwares: [],
  filteredHardwares: [],
  isEditing: false,
  editingId: null,
  pendingDeleteId: null,
  isLoading: false,
};

// 3. Elementos do DOM
const elements = {
  // Formulário
  form: document.getElementById('hardwareForm'),
  formTitle: document.getElementById('formTitle'),
  hardwareId: document.getElementById('hardwareId'),
  hardwareInput: document.getElementById('hardwareInput'),
  marcaInput: document.getElementById('marcaInput'),
  modeloInput: document.getElementById('modeloInput'),
  precoInput: document.getElementById('precoInput'),
  fotoInput: document.getElementById('fotoInput'),
  btnSubmit: document.getElementById('btnSubmitForm'),
  btnReset: document.getElementById('btnResetForm'),
  btnCancelEdit: document.getElementById('btnCancelEdit'),
  imagePreviewContainer: document.getElementById('imagePreviewContainer'),
  imagePreview: document.getElementById('imagePreview'),

  // Erros de campos
  errorHardware: document.getElementById('errorHardware'),
  errorMarca: document.getElementById('errorMarca'),
  errorModelo: document.getElementById('errorModelo'),
  errorPreco: document.getElementById('errorPreco'),
  errorFoto: document.getElementById('errorFoto'),

  // Listagem e Estados
  grid: document.getElementById('hardwareGrid'),
  loadingState: document.getElementById('loadingState'),
  errorState: document.getElementById('errorState'),
  errorMessageText: document.getElementById('errorMessageText'),
  emptyState: document.getElementById('emptyState'),
  itemsCountBadge: document.getElementById('itemsCountBadge'),
  searchInput: document.getElementById('searchInput'),
  btnRefreshList: document.getElementById('btnRefreshList'),
  btnRetryLoad: document.getElementById('btnRetryLoad'),

  // Modal de Exclusão
  deleteModal: document.getElementById('deleteModal'),
  deleteTargetName: document.getElementById('deleteTargetName'),
  btnConfirmDelete: document.getElementById('btnConfirmDelete'),
  btnCancelDelete: document.getElementById('btnCancelDelete'),

  // Status e Notificações
  apiStatusBadge: document.getElementById('apiStatusBadge'),
  toastContainer: document.getElementById('toastContainer'),
};

// 4. Utilitários de Formatação
const formatters = {
  currency: new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }),
  formatMoney(value) {
    const num = Number(value);
    return isNaN(num) ? 'R$ 0,00' : this.currency.format(num);
  },
  sanitize(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },
};

// 5. Sistema de Notificações Toast
function showToast(message, type = 'info', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';

  toast.innerHTML = `
    <i class="${iconClass}"></i>
    <span>${formatters.sanitize(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 6. Atualização do Badge de Status da API
function updateApiStatus(isOnline) {
  const dot = elements.apiStatusBadge.querySelector('.status-dot');
  const text = elements.apiStatusBadge.querySelector('.status-text');

  dot.classList.remove('online', 'offline');
  if (isOnline) {
    dot.classList.add('online');
    text.textContent = 'API Conectada';
  } else {
    dot.classList.add('offline');
    text.textContent = 'API Desconectada';
  }
}

// 7. Consumo da API (Fetch Wrapper)
async function apiRequest(endpoint = '', options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({
    success: false,
    error: { message: 'Resposta inválida do servidor.' },
  }));

  if (!response.ok || data.success === false) {
    const errorMsg =
      (data.error && data.error.message) ||
      `Erro na requisição (Status HTTP ${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

// 8. Carregar Lista de Hardwares
async function loadHardwares() {
  setLoadingState(true);
  hideAllStates();

  try {
    const response = await apiRequest();
    state.hardwares = response.data || [];
    filterAndRenderHardwares();
    updateApiStatus(true);
  } catch (error) {
    console.error('Erro ao carregar hardwares:', error);
    updateApiStatus(false);
    showErrorState(error.message);
  } finally {
    setLoadingState(false);
  }
}

// 9. Renderização da Interface
function filterAndRenderHardwares() {
  const query = elements.searchInput.value.trim().toLowerCase();

  if (!query) {
    state.filteredHardwares = [...state.hardwares];
  } else {
    state.filteredHardwares = state.hardwares.filter((item) => {
      const h = (item.hardware || '').toLowerCase();
      const m = (item.marca || '').toLowerCase();
      const mod = (item.modelo || '').toLowerCase();
      return h.includes(query) || m.includes(query) || mod.includes(query);
    });
  }

  // Atualiza contador
  const total = state.filteredHardwares.length;
  elements.itemsCountBadge.textContent = `${total} aparelho${total === 1 ? '' : 's'}`;

  // Estados de exibição
  if (state.hardwares.length === 0) {
    elements.emptyState.classList.remove('hidden');
    elements.grid.innerHTML = '';
    return;
  }

  if (state.filteredHardwares.length === 0) {
    elements.grid.innerHTML = `
      <div class="card state-container" style="grid-column: 1 / -1;">
        <i class="fa-solid fa-magnifying-glass state-icon"></i>
        <h3>Nenhum resultado encontrado</h3>
        <p>Não encontramos nenhum hardware com o termo "${formatters.sanitize(query)}".</p>
      </div>
    `;
    return;
  }

  elements.emptyState.classList.add('hidden');
  renderCards(state.filteredHardwares);
}

function renderCards(items) {
  elements.grid.innerHTML = items
    .map((item) => {
      const id = item._id || item.id;
      const hasPhoto = item.foto && item.foto.trim() !== '';

      const photoHtml = hasPhoto
        ? `<img src="${formatters.sanitize(item.foto)}" alt="${formatters.sanitize(item.hardware)}" loading="lazy" onerror="handleImageError(this)" />`
        : `
          <div class="card-image-placeholder">
            <i class="fa-solid fa-microchip"></i>
            <span>Sem Imagem</span>
          </div>
        `;

      return `
        <article class="hardware-card" data-id="${id}">
          <div class="card-image-box">
            ${photoHtml}
            <span class="card-badge">${formatters.sanitize(item.hardware)}</span>
          </div>
          <div class="card-content">
            <h3 class="card-title">${formatters.sanitize(item.modelo)}</h3>
            <div class="card-details">
              <div class="detail-row">
                <span class="detail-label">Marca:</span>
                <span>${formatters.sanitize(item.marca)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tipo:</span>
                <span>${formatters.sanitize(item.hardware)}</span>
              </div>
            </div>
            <div class="card-price-row">
              <span class="price-label">Preço</span>
              <span class="price-value">${formatters.formatMoney(item.preco)}</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary btn-sm" onclick="startEdit('${id}')">
                <i class="fa-solid fa-pen-to-square"></i> Editar
              </button>
              <button class="btn btn-outline btn-sm btn-danger-hover" onclick="promptDelete('${id}', '${formatters.sanitize(item.hardware)} - ${formatters.sanitize(item.modelo)}')">
                <i class="fa-solid fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

// Fallback caso a imagem externa falhe ao carregar
window.handleImageError = function (imgElement) {
  const container = imgElement.parentElement;
  container.innerHTML = `
    <div class="card-image-placeholder">
      <i class="fa-solid fa-image-slash"></i>
      <span>Imagem Indisponível</span>
    </div>
  `;
};

// 10. Manipulação de Formulário (Validação e Envio)
function clearFormErrors() {
  elements.errorHardware.textContent = '';
  elements.errorMarca.textContent = '';
  elements.errorModelo.textContent = '';
  elements.errorPreco.textContent = '';
  elements.errorFoto.textContent = '';
}

function validateForm() {
  clearFormErrors();
  let isValid = true;

  const hardware = elements.hardwareInput.value.trim();
  const marca = elements.marcaInput.value.trim();
  const modelo = elements.modeloInput.value.trim();
  const preco = elements.precoInput.value;
  const foto = elements.fotoInput.value.trim();

  if (!hardware) {
    elements.errorHardware.textContent = 'Informe o tipo ou nome do hardware.';
    isValid = false;
  }

  if (!marca) {
    elements.errorMarca.textContent = 'Informe o fabricante do aparelho.';
    isValid = false;
  }

  if (!modelo) {
    elements.errorModelo.textContent = 'Informe o modelo do aparelho.';
    isValid = false;
  }

  if (preco === '' || isNaN(Number(preco))) {
    elements.errorPreco.textContent = 'Informe um preço numérico válido.';
    isValid = false;
  } else if (Number(preco) < 0) {
    elements.errorPreco.textContent = 'O preço não pode ser negativo.';
    isValid = false;
  }

  if (foto) {
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (!urlPattern.test(foto)) {
      elements.errorFoto.textContent = 'A foto deve iniciar com http:// ou https://';
      isValid = false;
    }
  }

  return isValid;
}

elements.form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showToast('Por favor, corrija os campos indicados.', 'error');
    return;
  }

  const payload = {
    hardware: elements.hardwareInput.value.trim(),
    marca: elements.marcaInput.value.trim(),
    modelo: elements.modeloInput.value.trim(),
    preco: parseFloat(elements.precoInput.value),
    foto: elements.fotoInput.value.trim(),
  };

  setSubmitting(true);

  try {
    if (state.isEditing) {
      // Atualização (PUT)
      await apiRequest(`/${state.editingId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast('Aparelho atualizado com sucesso!', 'success');
    } else {
      // Criação (POST)
      await apiRequest('', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      showToast('Aparelho cadastrado com sucesso!', 'success');
    }

    resetForm();
    await loadHardwares();
  } catch (error) {
    console.error('Erro ao salvar hardware:', error);
    showToast(error.message, 'error');
  } finally {
    setSubmitting(false);
  }
});

// Pré-visualização de imagem ao digitar
elements.fotoInput.addEventListener('input', () => {
  const url = elements.fotoInput.value.trim();
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    elements.imagePreview.src = url;
    elements.imagePreviewContainer.classList.remove('hidden');
    elements.imagePreview.onerror = () => {
      elements.imagePreviewContainer.classList.add('hidden');
    };
  } else {
    elements.imagePreviewContainer.classList.add('hidden');
    elements.imagePreview.src = '';
  }
});

// 11. Edição
window.startEdit = function (id) {
  const item = state.hardwares.find((h) => (h._id || h.id) === id);
  if (!item) return;

  state.isEditing = true;
  state.editingId = id;

  elements.formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Aparelho`;
  elements.btnSubmit.innerHTML = `<i class="fa-solid fa-check"></i> Salvar Alterações`;
  elements.btnCancelEdit.classList.remove('hidden');

  elements.hardwareId.value = id;
  elements.hardwareInput.value = item.hardware || '';
  elements.marcaInput.value = item.marca || '';
  elements.modeloInput.value = item.modelo || '';
  elements.precoInput.value = item.preco !== undefined ? item.preco : '';
  elements.fotoInput.value = item.foto || '';

  // Trigger preview se houver foto
  if (item.foto) {
    elements.imagePreview.src = item.foto;
    elements.imagePreviewContainer.classList.remove('hidden');
  } else {
    elements.imagePreviewContainer.classList.add('hidden');
  }

  // Scroll suave até o formulário no mobile
  elements.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function cancelEdit() {
  state.isEditing = false;
  state.editingId = null;
  elements.formTitle.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Cadastrar Aparelho`;
  elements.btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar Aparelho`;
  elements.btnCancelEdit.classList.add('hidden');
  resetForm();
}

function resetForm() {
  elements.form.reset();
  elements.hardwareId.value = '';
  elements.imagePreviewContainer.classList.add('hidden');
  elements.imagePreview.src = '';
  clearFormErrors();
  if (state.isEditing) {
    cancelEdit();
  }
}

elements.btnCancelEdit.addEventListener('click', cancelEdit);
elements.btnReset.addEventListener('click', resetForm);

// 12. Exclusão (Modal de Confirmação)
window.promptDelete = function (id, name) {
  state.pendingDeleteId = id;
  elements.deleteTargetName.textContent = name;
  elements.deleteModal.classList.remove('hidden');
};

function closeDeleteModal() {
  state.pendingDeleteId = null;
  elements.deleteModal.classList.add('hidden');
}

elements.btnCancelDelete.addEventListener('click', closeDeleteModal);

elements.btnConfirmDelete.addEventListener('click', async () => {
  if (!state.pendingDeleteId) return;

  const id = state.pendingDeleteId;
  elements.btnConfirmDelete.disabled = true;
  elements.btnConfirmDelete.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Excluindo...`;

  try {
    await apiRequest(`/${id}`, { method: 'DELETE' });
    showToast('Aparelho excluído com sucesso!', 'success');
    closeDeleteModal();

    // Se estávamos editando o item excluído, cancela edição
    if (state.editingId === id) {
      cancelEdit();
    }

    await loadHardwares();
  } catch (error) {
    console.error('Erro ao excluir hardware:', error);
    showToast(error.message, 'error');
  } finally {
    elements.btnConfirmDelete.disabled = false;
    elements.btnConfirmDelete.innerHTML = `<i class="fa-solid fa-trash"></i> Sim, Excluir`;
  }
});

// Fechar modal ao clicar fora da caixa
elements.deleteModal.addEventListener('click', (e) => {
  if (e.target === elements.deleteModal) {
    closeDeleteModal();
  }
});

// 13. Busca e Filtros
elements.searchInput.addEventListener('input', () => {
  filterAndRenderHardwares();
});

elements.btnRefreshList.addEventListener('click', () => {
  loadHardwares();
});

elements.btnRetryLoad.addEventListener('click', () => {
  loadHardwares();
});

// 14. Gerenciamento de Estados Visuais
function setLoadingState(loading) {
  state.isLoading = loading;
  if (loading) {
    elements.loadingState.classList.remove('hidden');
    elements.grid.classList.add('hidden');
  } else {
    elements.loadingState.classList.add('hidden');
    elements.grid.classList.remove('hidden');
  }
}

function showErrorState(message) {
  elements.errorMessageText.textContent =
    message || 'Verifique se o backend está executando na porta correta.';
  elements.errorState.classList.remove('hidden');
  elements.grid.innerHTML = '';
}

function hideAllStates() {
  elements.loadingState.classList.add('hidden');
  elements.errorState.classList.add('hidden');
  elements.emptyState.classList.add('hidden');
}

function setSubmitting(isSubmitting) {
  elements.btnSubmit.disabled = isSubmitting;
  if (isSubmitting) {
    elements.btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processando...`;
  } else {
    if (state.isEditing) {
      elements.btnSubmit.innerHTML = `<i class="fa-solid fa-check"></i> Salvar Alterações`;
    } else {
      elements.btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Salvar Aparelho`;
    }
  }
}

// 15. Inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadHardwares();
});
