// Simula um banco de dados no servidor
let serverDatabase = [];
let currentRequestType = '';
let requestCounter = 0;

// Inicializa com alguns dados
serverDatabase.push({
    id: 1,
    juice: "Suco de Laranja",
    portion: "Batata Frita",
    mainDish: "Hambúrguer",
    status: "Para Comer Aqui"
});

// Ajusta o contador para não repetir IDs
requestCounter = serverDatabase.length;

// Atualiza a visualização dos dados armazenados
function updateStorageView() {
    const storedDataDiv = document.getElementById('storedData');
    
    if (serverDatabase.length === 0) {
        storedDataDiv.innerHTML = '<p style="color: #999;">Nenhum dado armazenado ainda...</p>';
        return;
    }
    
    storedDataDiv.innerHTML = serverDatabase.map(item => `
        <div class="data-item" id="item-${item.id}">
            <div>
                <strong>Pedido #${item.id}</strong> - <em>${item.status}</em><br>
                Suco: ${item.juice} | Porção: ${item.portion} | Prato: ${item.mainDish}
            </div>
            <button class="delete-btn" onclick="deleteItem(${item.id})">Deletar</button>
        </div>
    `).join('');
}

// Função principal para fazer requisição
function makeRequest(type) {
    currentRequestType = type;
    
    // Se for POST, mostra o formulário de POST
    if (type === 'POST') {
        document.getElementById('inputArea').style.display = 'block';
        return;
    }
    
    // Se for PUT, mostra o formulário de PUT (alternar status)
    if (type === 'PUT') {
        if (serverDatabase.length === 0) {
            alert('Não há pedidos! Primeiro adicione algo com POST.');
            return;
        }
        populatePutFormForStatus();
        document.getElementById('putArea').style.display = 'block';
        return;
    }
    
    // Se for PATCH, mostra o formulário de PATCH (editar pedido)
    if (type === 'PATCH') {
        if (serverDatabase.length === 0) {
            alert('Não há pedidos para editar! Primeiro adicione algo com POST.');
            return;
        }
        populatePatchForm();
        document.getElementById('patchArea').style.display = 'block';
        return;
    }
    
    // Para GET e DELETE, executa direto ou mostra formulário
    if (type === 'GET') {
        executeRequest('GET');
    } else if (type === 'DELETE') {
        if (serverDatabase.length === 0) {
            alert('Não há dados para deletar! Primeiro adicione algo com POST.');
            return;
        }
        populateDeleteForm();
        document.getElementById('deleteArea').style.display = 'block';
    }
}

// Popula o formulário de DELETE com os pedidos existentes
function populateDeleteForm() {
    const select = document.getElementById('orderToDelete');
    select.innerHTML = '<option value="">Selecione um pedido para deletar</option>';
    
    serverDatabase.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `Pedido #${item.id}: ${item.juice}, ${item.portion}, ${item.mainDish}`;
        select.appendChild(option);
    });
}

// Popula o formulário de PUT para alternar status
function populatePutFormForStatus() {
    const select = document.getElementById('orderToToggleStatus');
    select.innerHTML = '<option value="">Selecione um pedido</option>';
    
    serverDatabase.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `Pedido #${item.id} - ${item.status}: ${item.juice}, ${item.portion}, ${item.mainDish}`;
        select.appendChild(option);
    });
}

// Popula o formulário de PATCH com os pedidos existentes
function populatePatchForm() {
    const select = document.getElementById('orderToUpdate');
    select.innerHTML = '<option value="">Selecione um pedido</option>';
    
    serverDatabase.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `Pedido #${item.id}: ${item.juice}, ${item.portion}, ${item.mainDish}`;
        select.appendChild(option);
    });
    
    // Mostra os campos de novos itens quando selecionar um pedido
    select.onchange = function() {
        const newItemsDiv = document.getElementById('patchNewItems');
        if (this.value) {
            newItemsDiv.style.display = 'block';
        } else {
            newItemsDiv.style.display = 'none';
        }
    };
}

// Submete dados do formulário POST
function submitData() {
    const juice = document.getElementById('juice').value;
    const portion = document.getElementById('portion').value;
    const mainDish = document.getElementById('mainDish').value;
    
    if (!juice || !portion || !mainDish) {
        alert('Por favor, selecione todas as opções do pedido!');
        return;
    }
    
    executeRequest('POST', null, { juice, portion, mainDish, status: "Para Comer Aqui" });
    
    // Limpa o formulário
    document.getElementById('juice').value = '';
    document.getElementById('portion').value = '';
    document.getElementById('mainDish').value = '';
    document.getElementById('inputArea').style.display = 'none';
}

// Submete dados do formulário PUT (alternar status)
function submitPutData() {
    const orderId = document.getElementById('orderToToggleStatus').value;
    
    if (!orderId) {
        alert('Por favor, selecione um pedido para alternar o status!');
        return;
    }
    
    executeRequest('PUT', parseInt(orderId));
    
    // Limpa o formulário
    document.getElementById('orderToToggleStatus').value = '';
    document.getElementById('putArea').style.display = 'none';
}

// Submete dados do formulário PATCH (editar pedido)
function submitPatchData() {
    const orderId = document.getElementById('orderToUpdate').value;
    const newJuice = document.getElementById('newJuice').value;
    const newPortion = document.getElementById('newPortion').value;
    const newMainDish = document.getElementById('newMainDish').value;
    
    if (!orderId) {
        alert('Por favor, selecione um pedido para editar!');
        return;
    }
    
    if (!newJuice || !newPortion || !newMainDish) {
        alert('Por favor, selecione todos os novos itens!');
        return;
    }
    
    executeRequest('PATCH', parseInt(orderId), { juice: newJuice, portion: newPortion, mainDish: newMainDish });
    
    // Limpa o formulário
    document.getElementById('orderToUpdate').value = '';
    document.getElementById('newJuice').value = '';
    document.getElementById('newPortion').value = '';
    document.getElementById('newMainDish').value = '';
    document.getElementById('patchNewItems').style.display = 'none';
    document.getElementById('patchArea').style.display = 'none';
}

// Submete dados do formulário DELETE
function submitDeleteData() {
    const orderId = document.getElementById('orderToDelete').value;
    
    if (!orderId) {
        alert('Por favor, selecione um pedido para deletar!');
        return;
    }
    
    executeRequest('DELETE', parseInt(orderId));
    
    // Limpa o formulário
    document.getElementById('orderToDelete').value = '';
    document.getElementById('deleteArea').style.display = 'none';
}

// Cancela input
function cancelInput() {
    document.getElementById('inputArea').style.display = 'none';
    document.getElementById('putArea').style.display = 'none';
    document.getElementById('patchArea').style.display = 'none';
    document.getElementById('deleteArea').style.display = 'none';
    document.getElementById('juice').value = '';
    document.getElementById('portion').value = '';
    document.getElementById('mainDish').value = '';
}

// Executa a requisição
function executeRequest(method, itemId = null, data = null) {
    // Anima o garçom
    animateWaiter(method);
    
    // Atualiza status do servidor
    const serverStatus = document.getElementById('serverStatus');
    serverStatus.className = 'server-status processing';
    serverStatus.innerHTML = '<p>Processando pedido...</p>';
    
    // Simula delay de rede
    setTimeout(() => {
        const response = processRequest(method, itemId, data);
        showResponse(response);
        
        // Atualiza servidor
        serverStatus.className = 'server-status';
        serverStatus.innerHTML = '<p>Pedido processado!</p>';
        
        // Atualiza visualização dos dados
        updateStorageView();
    }, 2000);
}

// Anima o garçom
function animateWaiter(method) {
    const waiter = document.getElementById('waiter');
    const bubble = document.getElementById('messageBubble');
    
    const messages = {
        'GET': '"Trazendo o cardápio!"',
        'POST': '"Esse é o pedido!"',
        'PUT': '"Muda o status!"',
        'PATCH': '"Troca esse pedido!"',
        'DELETE': '"Cancela esse pedido"'
    };
    
    bubble.textContent = messages[method];
    bubble.classList.add('show');
    
    // Remove classes antigas
    waiter.classList.remove('walking-to-kitchen', 'walking-to-client');
    
    // Adiciona a classe apropriada baseada no método
    if (method === 'GET') {
        waiter.classList.add('walking-to-client');
    } else {
        waiter.classList.add('walking-to-kitchen');
    }
    
    setTimeout(() => {
        waiter.classList.remove('walking-to-kitchen', 'walking-to-client');
        bubble.classList.remove('show');
    }, 2000);
}

// Processa a requisição no "servidor"
function processRequest(method, itemId, data) {
    let response = {
        method: method,
        statusCode: 200,
        statusText: 'OK',
        statusType: 'success',
        headers: {
            'Content-Type': 'application/json',
            'Date': new Date().toUTCString(),
            'Server': 'O-Servidor-Magico/1.0',
            'X-Garcom': 'HTTP'
        },
        body: null
    };
    
    try {
        switch(method) {
            case 'GET':
                // Simula sucesso ou não encontrado
                if (Math.random() > 0.1) { // 90% de chance de sucesso
                    response.body = {
                        message: 'Aqui está o cardápio!',
                        data: serverDatabase,
                        total: serverDatabase.length
                    };
                } else {
                    // Simula erro 404
                    response.statusCode = 404;
                    response.statusText = 'Not Found';
                    response.statusType = 'error-client';
                    response.body = {
                        error: 'Desculpa, não achei "Pizza de Unicórnio" no cardápio!',
                        message: 'O item solicitado não existe'
                    };
                }
                break;
                
            case 'POST':
                // Adiciona novo item
                const nextId = serverDatabase.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
                requestCounter = nextId;
                const newItem = {
                    id: nextId,
                    juice: data.juice,
                    portion: data.portion,
                    mainDish: data.mainDish,
                    status: data.status || "Para Comer Aqui"
                };
                serverDatabase.push(newItem);
                
                response.statusCode = 201;
                response.statusText = 'Created';
                response.body = {
                    message: 'Pedido guardado com sucesso!',
                    created: newItem
                };
                break;
                
            case 'PUT':
                // Alterna o status do pedido
                const itemToToggle = serverDatabase.find(item => item.id === itemId);
                if (itemToToggle) {
                    const oldStatus = itemToToggle.status;
                    itemToToggle.status = itemToToggle.status === "Para Comer Aqui" ? "Para Viagem" : "Para Comer Aqui";
                    
                    response.body = {
                        message: `Status do pedido #${itemId} alterado!`,
                        oldStatus: oldStatus,
                        newStatus: itemToToggle.status,
                        order: itemToToggle
                    };
                } else {
                    response.statusCode = 404;
                    response.statusText = 'Not Found';
                    response.statusType = 'error-client';
                    response.body = {
                        error: 'Pedido não encontrado!'
                    };
                }
                break;
                
            case 'PATCH':
                // Edita item existente parcialmente
                const itemToUpdate = serverDatabase.find(item => item.id === itemId);
                if (itemToUpdate) {
                    const oldData = { ...itemToUpdate };
                    itemToUpdate.juice = data.juice;
                    itemToUpdate.portion = data.portion;
                    itemToUpdate.mainDish = data.mainDish;
                    
                    response.body = {
                        message: `Pedido #${itemId} atualizado com sucesso!`,
                        old: oldData,
                        updated: itemToUpdate
                    };
                } else {
                    response.statusCode = 404;
                    response.statusText = 'Not Found';
                    response.statusType = 'error-client';
                    response.body = {
                        error: 'Pedido não encontrado!'
                    };
                }
                break;
                
            case 'DELETE':
                // Deleta item
                const index = serverDatabase.findIndex(item => item.id === itemId);
                if (index !== -1) {
                    const deleted = serverDatabase.splice(index, 1)[0];
                    response.statusCode = 200;
                    response.body = {
                        message: 'Item deletado com sucesso!',
                        deleted: deleted
                    };
                } else {
                    response.statusCode = 404;
                    response.statusText = 'Not Found';
                    response.statusType = 'error-client';
                    response.body = {
                        error: 'Não encontrei esse item para deletar!'
                    };
                }
                break;
        }
        
        // Simula erro 500 aleatoriamente (5% de chance)
        if (Math.random() > 0.95) {
            response.statusCode = 500;
            response.statusText = 'Internal Server Error';
            response.statusType = 'error-server';
            response.body = {
                error: 'Desculpa! O fogão explodiu e o cozinheiro desmaiou!',
                message: 'Erro interno do servidor'
            };
        }
        
    } catch (error) {
        response.statusCode = 500;
        response.statusText = 'Internal Server Error';
        response.statusType = 'error-server';
        response.body = {
            error: 'Algo deu muito errado na cozinha!',
            details: error.message
        };
    }
    
    return response;
}

// Mostra a resposta
function showResponse(response) {
    const responseArea = document.getElementById('responseArea');
    const statusCode = document.getElementById('statusCode');
    const headers = document.getElementById('headers');
    const body = document.getElementById('body');
    const detailsArea = document.getElementById('detailsArea');
    
    // Status Code
    statusCode.className = `status-code ${response.statusType}`;
    statusCode.innerHTML = `
        ${response.statusCode} ${response.statusText}
        <div style="font-size: 0.7em; margin-top: 10px;">
            ${getStatusMessage(response.statusCode)}
        </div>
    `;
    
    // Headers
    headers.textContent = JSON.stringify(response.headers, null, 2);
    
    // Body
    body.textContent = JSON.stringify(response.body, null, 2);
    
    // Mostra o bloco de resposta dentro da cozinha
    if (responseArea) {
        responseArea.style.display = 'grid';
    }
    if (detailsArea) {
        detailsArea.style.display = 'grid';
    }
    closeDropdown('headersPanel', 'headersToggle');
    closeDropdown('bodyPanel', 'bodyToggle');
}

// Mensagens dos status codes
function getStatusMessage(code) {
    const messages = {
        200: 'O garçom diz: "Tudo certo! Aqui está o que você pediu."',
        201: 'O garçom diz: "Criado com sucesso! Guardei na gaveta."',
        404: 'O garçom diz: "Procurei, mas não encontrei isso no cardápio..."',
        500: 'O garçom volta sujo de fuligem: "Desculpa, o fogão explodiu!"'
    };
    return messages[code] || 'Resposta do servidor';
}

// Deleta item diretamente da lista
function deleteItem(itemId) {
    executeRequest('DELETE', itemId);
}

// Dropdown para headers e body
function toggleDropdown(panelId, triggerId) {
    const panel = document.getElementById(panelId);
    const trigger = document.getElementById(triggerId);
    if (!panel) return;
    const isOpen = panel.classList.toggle('open');
    panel.style.display = isOpen ? 'block' : 'none';
    if (trigger) {
        trigger.classList.toggle('open', isOpen);
        trigger.setAttribute('aria-expanded', isOpen);
    }
}

function closeDropdown(panelId, triggerId) {
    const panel = document.getElementById(panelId);
    const trigger = document.getElementById(triggerId);
    if (!panel) return;
    panel.classList.remove('open');
    panel.style.display = 'none';
    if (trigger) {
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
    }
}

// Inicializa a visualização
updateStorageView();

// Áudio ambiente
function initAmbientAudio() {
    const audioEl = document.getElementById('ambientAudio');
    const toggleBtn = document.getElementById('audioToggle');
    if (!audioEl || !toggleBtn) return;

    audioEl.volume = 1;
    audioEl.muted = false;
    audioEl.loop = true;

    audioEl.play().catch(() => {
        toggleBtn.textContent = '🔈 Ambiente (clique para ligar)';
        toggleBtn.classList.add('off');
    });
}

function toggleAmbientAudio() {
    const audioEl = document.getElementById('ambientAudio');
    const toggleBtn = document.getElementById('audioToggle');
    if (!audioEl || !toggleBtn) return;

    const isMuted = audioEl.muted || audioEl.paused;
    if (isMuted) {
        audioEl.muted = false;
        audioEl.play();
        toggleBtn.textContent = '🔊 Ambiente ligado';
        toggleBtn.classList.remove('off');
    } else {
        audioEl.muted = true;
        audioEl.pause();
        toggleBtn.textContent = '🔈 Ambiente desligado';
        toggleBtn.classList.add('off');
    }
}

window.addEventListener('load', initAmbientAudio);

// Entrada na aplicação a partir da tela inicial
function enterSite() {
    const intro = document.getElementById('introScreen');
    const app = document.getElementById('appContent');
    if (intro) intro.style.display = 'none';
    if (app) app.style.display = 'block';
}
