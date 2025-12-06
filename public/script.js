const API_URL = 'http://localhost:3000';

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
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        document.getElementById('consultationList').innerHTML = '<p class="error">Erro ao carregar histórico.</p>';
    }
}

async function loadMedicalRecords() {
    try {
    } catch (error) {
        console.error('Erro ao carregar prontuários:', error);
    }
}

async function loadUnitsDropdown() {
    try {
        const response = await fetch(`${API_URL}/units`);
        const units = await response.json();
        document.querySelectorAll('select[name="id_unidade"]').forEach(select => {
            select.innerHTML = '<option value="">Selecione uma unidade</option>' +
                units.map(u => `<option value="${u.id_unidade}">${u.nome}</option>`).join('');
        });
    } catch (error) {
        console.error('Erro ao carregar unidades dropdown:', error);
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
        const response = await fetch(`${API_URL}/users`);
        await response.json();
    } catch (error) {
        console.error('Erro ao carregar consultas dropdown:', error);
    }
}

window.addEventListener('load', () => {
    loadUnitsDropdown();
    loadTabData('unidades');
});