const API_URL = 'http://localhost:3000';

/* -------------------------- SEGURANÇA E LOGIN -------------------------- */

// Verifica se o usuário está logado ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('vidaPlusUserRole');
    
    // Se não tiver usuário salvo, chuta de volta para o login
    if (!userRole) {
        window.location.href = 'index.html';
        return;
    }

    // Opcional: Mostra o nome do usuário na tela e botão de sair
    setupLogout();
    adjustInterfaceByRole(userRole);
});

function setupLogout() {
    const header = document.querySelector('header');
    
    // Cria um container para info do usuário se não existir
    if (!document.getElementById('user-info')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'user-info';
        userInfo.style.position = 'absolute';
        userInfo.style.top = '10px';
        userInfo.style.right = '20px';
        userInfo.style.textAlign = 'right';
        
        const role = localStorage.getItem('vidaPlusUserRole').toUpperCase();
        
        userInfo.innerHTML = `
            <small>Logado como: <strong>${role}</strong></small><br>
            <button onclick="doLogout()" style="padding: 5px 10px; font-size: 0.8rem; cursor: pointer; background: #e74c3c; color: white; border: none; border-radius: 4px;">Sair</button>
        `;
        header.appendChild(userInfo);
    }
}

function doLogout() {
    localStorage.removeItem('vidaPlusUserRole');
    localStorage.removeItem('vidaPlusUserName');
    window.location.href = 'index.html';
}

// Controle de Acesso: Esconde abas que o usuário não deve ver
function adjustInterfaceByRole(role) {
    // Todos veem tudo por padrão, vamos esconder o que for proibido
    
    if (role === 'medico') {
        // Médicos não devem criar Unidades ou cadastrar novos Pacientes (regra de exemplo)
        // Esconde o botão da aba "Unidades" e "Pacientes"
        hideTab('unidades');
        // Mas médico precisa ver Pacientes para histórico... vamos deixar ver, mas talvez não editar.
        // Para simplificar o protótipo, vamos esconder apenas 'Unidades'
    } 
    
    if (role === 'recepcao') {
        // Recepção não mexe em Prontuários (regra ética)
        hideTab('prontuarios');
    }
}

function hideTab(tabName) {
    // Procura o botão da aba e esconde
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(tabName) || btn.getAttribute('onclick').includes(tabName)) {
            btn.style.display = 'none';
        }
    });
}




/* CODIGO DO SISTEMA */

function switchTab(event, tabName) {
    event.preventDefault();
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    loadTabData(tabName);
}

function loadTabData(tabName) {
    if (tabName === 'unidades') loadUnits();
    else if (tabName === 'pacientes') { loadUsers(); loadUnitsDropdown(); }
    else if (tabName === 'medicos') { loadDoctors(); loadUnitsDropdown(); }
    else if (tabName === 'consultas') { loadConsultations(); loadUsersDropdown(); loadDoctorsDropdown(); }
    else if (tabName === 'prontuarios') { loadMedicalRecords(); loadConsultationsDropdown(); }
}

async function submitForm(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (data.agenda_json) {
        try {
            data.agenda_json = JSON.parse(data.agenda_json);
        } catch {
            showMessage(type, 'Agenda JSON inválida', 'error');
            return;
        }
    }

    try {
        const response = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage(type, 'Registrado com sucesso!', 'success');
            form.reset();
            loadTabData(type);
            setTimeout(() => location.reload(), 1500);
        } else {
            const error = await response.json();
            showMessage(type, error.error || 'Erro ao registrar', 'error');
        }
    } catch (error) {
        showMessage(type, 'Erro ao conectar com servidor', 'error');
        console.error(error);
    }
}

function showMessage(type, message, messageType) {
    const messageDiv = document.getElementById(`${type}Message`);
    if (messageDiv) {
        messageDiv.innerHTML = `<div class="message ${messageType}">${message}</div>`;
        setTimeout(() => { messageDiv.innerHTML = ''; }, 5000);
    }
}

async function loadUnits() {
    try {
        const response = await fetch(`${API_URL}/units`);
        const units = await response.json();
        const container = document.getElementById('unitList');
        container.innerHTML = units.map(u => `
            <div class="list-item">
                <h4>${u.nome}</h4>
                <p><strong>Tipo:</strong> ${u.tipo_unidade}</p>
                <p><strong>Endereço:</strong> ${u.endereco}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar unidades:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const container = document.getElementById('userList');
        container.innerHTML = users.map(u => `
            <div class="list-item">
                <h4>${u.nome}</h4>
                <p><strong>CPF:</strong> ${u.cpf}</p>
                <p><strong>Data de Nascimento:</strong> ${new Date(u.data_nascimento).toLocaleDateString('pt-BR')}</p>
                <p><strong>Histórico:</strong> ${u.historico_clinico || 'Nenhum'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

async function loadDoctors() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const doctors = await response.json();
        const container = document.getElementById('doctorList');
        container.innerHTML = doctors.map(d => `
            <div class="list-item">
                <h4>Dr. ${d.nome}</h4>
                <p><strong>CRM:</strong> ${d.crm}</p>
                <p><strong>Especialidade:</strong> ${d.especialidade}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar médicos:', error);
    }
}

async function loadConsultations() {
    try {
        // 1. Ajustar a rota para /consultations (ou o nome que você definiu na rota do backend)
        const response = await fetch(`${API_URL}/consultations`);
        
        if (!response.ok) throw new Error('Falha ao buscar consultas');

        const consultations = await response.json();
        const container = document.getElementById('consultationList');

        // 2. Verificar se retornou algo vazio
        if (consultations.length === 0) {
            container.innerHTML = '<p>Nenhuma consulta registrada.</p>';
            return;
        }

        // 3. Renderizar o HTML
        container.innerHTML = consultations.map(c => `
            <div class="list-item ${c.status}">
                <h4>${new Date(c.data_hora).toLocaleString('pt-BR')}</h4>
                <p><strong>Paciente:</strong> ${c.paciente ? c.paciente.nome : 'Desconhecido'}</p>
                <p><strong>Médico:</strong> ${c.medico ? 'Dr. ' + c.medico.nome : 'Desconhecido'}</p>
                <p><strong>Tipo:</strong> ${c.tipo}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${c.status}">${c.status}</span></p>
                <button class="delete-btn" 
                    onclick="deleteItem('consultation', ${c.id_consulta})"
                    style="margin-top: 10px; background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    Deletar Consulta
                 </button>
            </div>
            
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        document.getElementById('consultationList').innerHTML = '<p class="error">Erro ao carregar histórico.</p>';
    }
}

// No seu arquivo script.js:
async function loadMedicalRecords() {
    try {
        // ✅ CORREÇÃO: Endpoint correto para buscar todos os prontuários
        const response = await fetch(`${API_URL}/medicalrecords`); 
        if (!response.ok) throw new Error('Falha ao buscar prontuários');

        const records = await response.json();
        const container = document.getElementById('medicalRecordList');
        
        if (records.length === 0) {
            container.innerHTML = '<p>Nenhum prontuário registrado.</p>';
            return;
        }

        // Renderiza a lista de prontuários
        container.innerHTML = records.map(p => {
            const consulta = p.consulta || {};
            const paciente = consulta.paciente || {};
            const medico = consulta.medico || {};

            return `
                <div class="list-item">
                    <h4>Prontuário #${p.id_prontuario}</h4>
                    <p><strong>Paciente:</strong> ${paciente.nome || 'N/A'}</p>
                    <p><strong>Médico:</strong> ${medico.nome ? 'Dr. ' + medico.nome : 'N/A'}</p>
                    <p><strong>Registro:</strong> ${new Date(p.data_registro).toLocaleString('pt-BR')}</p>
                    <p><strong>Descrição:</strong> ${p.descricao}</p>
                    <p><strong>Prescrição:</strong> ${p.prescricao || 'Nenhuma'}</p>
                    
                    <button class="delete-btn" 
                            onclick="deleteItem('medicalRecord', ${p.id_prontuario})"
                            style="margin-top: 10px; background-color: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Deletar Prontuário
                    </button>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Erro ao carregar prontuários:', error);
        document.getElementById('medicalRecordList').innerHTML = '<p class="error">Erro ao carregar histórico.</p>';
    }
}

async function loadUsersDropdown() {
    try {
        const response = await fetch(`${API_URL}/users`);
        const users = await response.json();
        const select = document.querySelector('select[name="id_paciente"]');
        if (select) {
            select.innerHTML = '<option value="">Selecione um paciente</option>' +
                users.map(u => `<option value="${u.id_paciente}">${u.nome}</option>`).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar pacientes dropdown:', error);
    }
}

async function loadUnitsDropdown() {
    try {
        const response = await fetch(`${API_URL}/units`);
        if (!response.ok) throw new Error('Falha ao buscar unidades');
        const units = await response.json();

        // Preenche todos os selects que usam id_unidade (pacientes e médicos)
        const selects = document.querySelectorAll('select[name="id_unidade"]');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Selecione uma unidade</option>' +
                units.map(u => `<option value="${u.id_unidade}">${u.nome}</option>`).join('');
        });
    } catch (error) {
        console.error('Erro ao carregar unidades dropdown:', error);
        // Em caso de erro, avisa o usuário nos selects existentes
        const selects = document.querySelectorAll('select[name="id_unidade"]');
        selects.forEach(s => {
            s.innerHTML = '<option value="">Erro ao carregar unidades</option>';
        });
    }
}

async function loadDoctorsDropdown() {
    try {
        const response = await fetch(`${API_URL}/doctors`);
        const doctors = await response.json();
        const select = document.querySelector('select[name="id_medico"]');
        if (select) {
            select.innerHTML = '<option value="">Selecione um médico</option>' +
                doctors.map(d => `<option value="${d.id_medico}">Dr. ${d.nome}</option>`).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar médicos dropdown:', error);
    }
}

async function loadConsultationsDropdown() {
    try {
        // ✅ CORREÇÃO: Buscando a rota correta para consultas
        const response = await fetch(`${API_URL}/consultations`);
        if (!response.ok) throw new Error('Falha ao buscar consultas para o dropdown');

        const consultations = await response.json();
        // Seleciona o dropdown correto dentro da aba de prontuários
        const select = document.querySelector('#prontuarios select[name="id_consulta"]');
        
        if (select) {
            // Adiciona a opção padrão
            select.innerHTML = '<option value="">Selecione uma consulta</option>';
            
            // Popula com as consultas
            consultations.forEach(c => {
                const option = document.createElement('option');
                option.value = c.id_consulta;
                
                // Formata o texto para ser informativo (Data, Paciente e Médico)
                const patientName = c.paciente ? c.paciente.nome : 'Desconhecido';
                const doctorName = c.medico ? 'Dr. ' + c.medico.nome : 'Desconhecido';
                const date = new Date(c.data_hora).toLocaleString('pt-BR');
                
                option.textContent = `${date} | Paciente: ${patientName} | Médico: ${doctorName}`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar consultas dropdown:', error);
        // Opcional: Avisar o usuário no console que a lista falhou
        const select = document.querySelector('#prontuarios select[name="id_consulta"]');
        if (select) select.innerHTML = '<option value="">Erro ao carregar</option>';
    }
}

window.addEventListener('load', () => {
    loadUnitsDropdown();
    loadTabData('unidades');
});

/* FUNCIONANDO DO BOTÃO DELETE! */

async function deleteItem(type, id) {
    if (!confirm(`Tem certeza que deseja deletar este ${type}? Esta ação é irreversível.`)) {
        return;
    }

    // Mapeamento para URL da API (type 'medicalRecord' -> URL 'medicalrecords')
    const urlType = type === 'medicalRecord' ? 'medicalrecords' : `${type}s`;

    try {
        const response = await fetch(`${API_URL}/${urlType}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showMessage(type, `${type.charAt(0).toUpperCase() + type.slice(1)} deletado(a) com sucesso!`, 'success');
            // Recarrega a lista da aba atual
            loadTabData(type === 'medicalRecord' ? 'prontuarios' : 'consultas'); 
        } else {
            const error = await response.json();
            showMessage(type, error.error || 'Erro ao deletar o item.', 'error');
        }
    } catch (error) {
        showMessage(type, 'Erro de conexão com servidor', 'error');
        console.error(error);
    }
}
