// Budget Management Application
// Main JavaScript file with all functionality

class BudgetManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setDefaultDates();
        await this.loadInitialData();
        this.showSection('dashboard');
        this.updateDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Form submissions
        document.getElementById('form-ingreso').addEventListener('submit', (e) => this.handleIngresoSubmit(e));
        document.getElementById('form-egreso').addEventListener('submit', (e) => this.handleEgresoSubmit(e));
        document.getElementById('form-presupuesto').addEventListener('submit', (e) => this.handlePresupuestoSubmit(e));
        document.getElementById('form-fondo').addEventListener('submit', (e) => this.handleFondoSubmit(e));
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('ingreso-fecha').value = today;
        document.getElementById('egreso-fecha').value = today;
    }

    async loadInitialData() {
        await this.loadCategorias();
        await this.loadFondos();
    }

    async loadCategorias() {
        try {
            // Load income categories
            const ingresoResponse = await this.apiCall('categoria_ingreso');
            const ingresoSelect = document.getElementById('ingreso-categoria');
            ingresoResponse.data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nombre;
                ingresoSelect.appendChild(option);
            });

            // Load expense categories
            const egresoResponse = await this.apiCall('categoria_egreso');
            const egresoSelect = document.getElementById('egreso-categoria');
            egresoResponse.data.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nombre;
                egresoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadFondos() {
        try {
            const response = await this.apiCall('fondo_inversion');
            this.updateFondosTable(response.data);
        } catch (error) {
            console.error('Error loading funds:', error);
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(sectionName).style.display = 'block';

        // Update navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        try {
            switch (sectionName) {
                case 'ingresos':
                    const ingresos = await this.apiCall('ingreso');
                    this.updateIngresosTable(ingresos.data);
                    break;
                case 'egresos':
                    const egresos = await this.apiCall('egreso');
                    this.updateEgresosTable(egresos.data);
                    break;
                case 'presupuestos':
                    const presupuestos = await this.apiCall('presupuesto_mensual');
                    this.updatePresupuestosTable(presupuestos.data);
                    break;
                case 'dashboard':
                    await this.updateDashboard();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${sectionName} data:`, error);
        }
    }

    async handleIngresoSubmit(e) {
        e.preventDefault();
        
        const data = {
            fecha: document.getElementById('ingreso-fecha').value,
            monto: parseFloat(document.getElementById('ingreso-monto').value),
            categoria_id: document.getElementById('ingreso-categoria').value,
            fuente: document.getElementById('ingreso-fuente').value,
            estado: document.getElementById('ingreso-estado').value
        };

        try {
            await this.apiCall('ingreso', 'POST', data);
            Swal.fire('Éxito', 'Ingreso guardado correctamente', 'success');
            document.getElementById('form-ingreso').reset();
            this.setDefaultDates();
            this.loadSectionData('ingresos');
            this.updateDashboard();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el ingreso', 'error');
        }
    }

    async handleEgresoSubmit(e) {
        e.preventDefault();
        
        const data = {
            fecha: document.getElementById('egreso-fecha').value,
            monto: parseFloat(document.getElementById('egreso-monto').value),
            categoria_id: document.getElementById('egreso-categoria').value,
            descripcion: document.getElementById('egreso-descripcion').value,
            metodo_pago: document.getElementById('egreso-metodo').value,
            estado: document.getElementById('egreso-estado').value
        };

        try {
            await this.apiCall('egreso', 'POST', data);
            Swal.fire('Éxito', 'Gasto guardado correctamente', 'success');
            document.getElementById('form-egreso').reset();
            this.setDefaultDates();
            this.loadSectionData('egresos');
            this.updateDashboard();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el gasto', 'error');
        }
    }

    async handlePresupuestoSubmit(e) {
        e.preventDefault();
        
        const data = {
            anio: parseInt(document.getElementById('presupuesto-anio').value),
            mes: parseInt(document.getElementById('presupuesto-mes').value),
            monto: parseFloat(document.getElementById('presupuesto-monto').value)
        };

        try {
            await this.apiCall('presupuesto_mensual', 'POST', data);
            Swal.fire('Éxito', 'Presupuesto guardado correctamente', 'success');
            document.getElementById('form-presupuesto').reset();
            this.loadSectionData('presupuestos');
            this.updateDashboard();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el presupuesto', 'error');
        }
    }

    async handleFondoSubmit(e) {
        e.preventDefault();
        
        const data = {
            nombre: document.getElementById('fondo-nombre').value,
            tipo: document.getElementById('fondo-tipo').value,
            descripcion: document.getElementById('fondo-descripcion').value
        };

        try {
            await this.apiCall('fondo_inversion', 'POST', data);
            Swal.fire('Éxito', 'Fondo de inversión guardado correctamente', 'success');
            document.getElementById('form-fondo').reset();
            this.loadFondos();
        } catch (error) {
            Swal.fire('Error', 'No se pudo guardar el fondo', 'error');
        }
    }

    updateIngresosTable(ingresos) {
        const tbody = document.querySelector('#tabla-ingresos tbody');
        tbody.innerHTML = '';
        
        ingresos.forEach(ingreso => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${new Date(ingreso.fecha).toLocaleDateString()}</td>
                <td>$${parseFloat(ingreso.monto).toFixed(2)}</td>
                <td>${this.getCategoriaNombre(ingreso.categoria_id, 'ingreso')}</td>
                <td>${ingreso.fuente || '-'}</td>
                <td><span class="badge badge-${ingreso.estado}">${ingreso.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="budgetManager.deleteRecord('ingreso', '${ingreso.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    updateEgresosTable(egresos) {
        const tbody = document.querySelector('#tabla-egresos tbody');
        tbody.innerHTML = '';
        
        egresos.forEach(egreso => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${new Date(egreso.fecha).toLocaleDateString()}</td>
                <td>$${parseFloat(egreso.monto).toFixed(2)}</td>
                <td>${this.getCategoriaNombre(egreso.categoria_id, 'egreso')}</td>
                <td>${egreso.descripcion || '-'}</td>
                <td>${egreso.metodo_pago}</td>
                <td><span class="badge badge-${egreso.estado}">${egreso.estado}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="budgetManager.deleteRecord('egreso', '${egreso.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    updatePresupuestosTable(presupuestos) {
        const tbody = document.querySelector('#tabla-presupuestos tbody');
        tbody.innerHTML = '';
        
        presupuestos.forEach(async (presupuesto) => {
            const gastosMes = await this.getGastosMes(presupuesto.anio, presupuesto.mes);
            const diferencia = presupuesto.monto - gastosMes;
            const porcentaje = (gastosMes / presupuesto.monto * 100).toFixed(1);
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${this.getNombreMes(presupuesto.mes)} ${presupuesto.anio}</td>
                <td>$${parseFloat(presupuesto.monto).toFixed(2)}</td>
                <td>$${gastosMes.toFixed(2)}</td>
                <td>$${diferencia.toFixed(2)}</td>
                <td>
                    <div class="progress" style="height: 20px;">
                        <div class="progress-bar ${porcentaje > 90 ? 'bg-danger' : porcentaje > 70 ? 'bg-warning' : 'bg-success'}" 
                             style="width: ${Math.min(porcentaje, 100)}%">
                            ${porcentaje}%
                        </div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="budgetManager.deleteRecord('presupuesto_mensual', '${presupuesto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    updateFondosTable(fondos) {
        const tbody = document.querySelector('#tabla-fondos tbody');
        tbody.innerHTML = '';
        
        fondos.forEach(fondo => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${fondo.nombre}</td>
                <td>${fondo.tipo}</td>
                <td>${fondo.descripcion || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="budgetManager.deleteRecord('fondo_inversion', '${fondo.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
        });
    }

    async updateDashboard() {
        try {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            
            // Get monthly income
            const ingresos = await this.apiCall('ingreso');
            const ingresosMes = ingresos.data.filter(i => {
                const fecha = new Date(i.fecha);
                return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
            });
            const totalIngresos = ingresosMes.reduce((sum, i) => sum + parseFloat(i.monto), 0);
            
            // Get monthly expenses
            const egresos = await this.apiCall('egreso');
            const egresosMes = egresos.data.filter(e => {
                const fecha = new Date(e.fecha);
                return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
            });
            const totalEgresos = egresosMes.reduce((sum, e) => sum + parseFloat(e.monto), 0);
            
            // Get budget
            const presupuestos = await this.apiCall('presupuesto_mensual');
            const presupuestoActual = presupuestos.data.find(p => 
                p.mes === currentMonth && p.anio === currentYear
            );
            const montoPresupuesto = presupuestoActual ? parseFloat(presupuestoActual.monto) : 0;
            
            const balance = totalIngresos - totalEgresos;
            
            // Update UI
            document.getElementById('total-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
            document.getElementById('total-egresos').textContent = `$${totalEgresos.toFixed(2)}`;
            document.getElementById('presupuesto-actual').textContent = `$${montoPresupuesto.toFixed(2)}`;
            document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
            
            // Update charts
            this.updateCharts(egresosMes, ingresosMes);
            
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    updateCharts(egresosMes, ingresosMes) {
        // Expense distribution chart
        const categoriasGastos = {};
        egresosMes.forEach(egreso => {
            const categoria = this.getCategoriaNombre(egreso.categoria_id, 'egreso');
            categoriasGastos[categoria] = (categoriasGastos[categoria] || 0) + parseFloat(egreso.monto);
        });
        
        const ctx1 = document.getElementById('gastos-chart').getContext('2d');
        if (this.charts.gastos) this.charts.gastos.destroy();
        
        this.charts.gastos = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoriasGastos),
                datasets: [{
                    data: Object.values(categoriasGastos),
                    backgroundColor: [
                        '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
                        '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        // Monthly trend chart
        const ctx2 = document.getElementById('tendencia-chart').getContext('2d');
        if (this.charts.tendencia) this.charts.tendencia.destroy();
        
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentMonth = new Date().getMonth();
        const last6Months = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
        
        // Calculate income and expenses for last 6 months
        const ingresosData = last6Months.map((_, index) => {
            const month = (currentMonth - 5 + index + 1) || 12;
            const year = new Date().getFullYear();
            const monthIngresos = ingresosMes.filter(i => {
                const fecha = new Date(i.fecha);
                return fecha.getMonth() + 1 === month && fecha.getFullYear() === year;
            });
            return monthIngresos.reduce((sum, i) => sum + parseFloat(i.monto), 0);
        });
        
        const egresosData = last6Months.map((_, index) => {
            const month = (currentMonth - 5 + index + 1) || 12;
            const year = new Date().getFullYear();
            const monthEgresos = egresosMes.filter(e => {
                const fecha = new Date(e.fecha);
                return fecha.getMonth() + 1 === month && fecha.getFullYear() === year;
            });
            return monthEgresos.reduce((sum, e) => sum + parseFloat(e.monto), 0);
        });
        
        this.charts.tendencia = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Ingresos',
                    data: ingresosData,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Gastos',
                    data: egresosData,
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    async deleteRecord(table, id) {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await this.apiCall(`${table}/${id}`, 'DELETE');
                Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
                this.loadSectionData(this.currentSection);
                this.updateDashboard();
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el registro', 'error');
            }
        }
    }

    async getGastosMes(anio, mes) {
        const egresos = await this.apiCall('egreso');
        const egresosMes = egresos.data.filter(e => {
            const fecha = new Date(e.fecha);
            return fecha.getFullYear() === anio && fecha.getMonth() + 1 === mes;
        });
        return egresosMes.reduce((sum, e) => sum + parseFloat(e.monto), 0);
    }

    getCategoriaNombre(categoriaId, tipo) {
        const select = document.getElementById(`${tipo}-categoria`);
        const option = select.querySelector(`option[value="${categoriaId}"]`);
        return option ? option.textContent : 'Desconocido';
    }

    getNombreMes(numeroMes) {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[numeroMes - 1];
    }

    async apiCall(endpoint, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`tables/${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return method === 'DELETE' ? null : await response.json();
    }
}

// Initialize the application
let budgetManager;

document.addEventListener('DOMContentLoaded', () => {
    budgetManager = new BudgetManager();
});