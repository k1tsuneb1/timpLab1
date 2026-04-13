import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function IncidentList() {
    const [incidents, setIncidents] = useState([]);
    
    //состояния для фильтров
    const [searchQuery, setSearchQuery] = useState('');
    const [filterThreat, setFilterThreat] = useState('Все');
    const [filterStatus, setFilterStatus] = useState('Все');
    

    //чтение данных с сервера (GET)
    const fetchIncidents = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/incidents');
            setIncidents(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке:", error);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    //удаление инцидента (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Удалить этот инцидент?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8080/api/incidents/${id}`);
            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };

    //вспомогательный метод для цвета уровня угрозы
    const getThreatColor = (level) => {
        switch(level) {
            case 'Низкий': return '#28a745'; 
            case 'Средний': return '#ffc107'; 
            case 'Высокий': return '#fd7e14'; 
            case 'Критический': return '#dc3545'; 
            default: return '#333';
        }
    };
    //вспомогательный метод для стилей статуса
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Открыт': return { color: '#dc3545', fontWeight: 'bold' }; // Красный текст
            case 'В работе': return { color: '#007bff', fontWeight: 'bold' }; // Синий текст
            case 'Закрыт': return { color: '#28a745', fontWeight: 'bold' }; // Зеленый текст
            default: return {};
        }
    };

    //фильтрация данных по уровню угрозы, статусу и поисковому запросу
    const filteredIncidents = incidents.filter(incident => {
        const matchThreat = filterThreat === 'Все' || incident.threatLevel === filterThreat;
        const matchStatus = filterStatus === 'Все' || incident.status === filterStatus;
        const matchSearch = incident.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchThreat && matchStatus && matchSearch; //должны совпасть все три условия
    });

    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            
            {/* шапка */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Сводка инцидентов</h2>
                
                {/* блок фильтров */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Поиск по описанию..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none', width: '200px' }}
                    />
                    
                    <select 
                        value={filterThreat} 
                        onChange={(e) => setFilterThreat(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                    >
                        <option value="Все">Все угрозы</option>
                        <option value="Низкий">Низкий</option>
                        <option value="Средний">Средний</option>
                        <option value="Высокий">Высокий</option>
                        <option value="Критический">Критический</option>
                    </select>

                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)} 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                    >
                        <option value="Все">Все статусы</option>
                        <option value="Открыт">Открыт</option>
                        <option value="В работе">В работе</option>
                        <option value="Закрыт">Закрыт</option>
                    </select>

                    <Link 
                        to="/add"
                        style={{
                            backgroundColor: '#007bff', color: 'white', textDecoration: 'none',
                            borderRadius: '50%', width: '40px', height: '40px', fontSize: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Добавить инцидент"
                    >
                        +
                    </Link>
                </div>
            </div>

            {/* таблица */}
            {filteredIncidents.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777', fontStyle: 'italic', padding: '20px' }}>
                    {incidents.length === 0 ? "Нет зарегистрированных инцидентов." : "По вашему запросу ничего не найдено."}
                </p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f1f1', borderBottom: '2px solid #ccc' }}>
                            <th style={{ padding: '12px' }}>Описание происшествия</th>
                            <th style={{ padding: '12px' }}>Уровень угрозы</th>
                            <th style={{ padding: '12px' }}>Статус</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIncidents.map((incident) => (
                            <tr key={incident.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>
                                    {/* делаем описание ссылкой на страницу деталей */}
                                    <Link to={`/incident/${incident.id}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                                        {incident.description}
                                    </Link>
                                    {/* и выводим мелко дату под описанием */}
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                        {incident.date || ''}
                                    </div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ 
                                        backgroundColor: getThreatColor(incident.threatLevel), 
                                        color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold'
                                    }}>
                                        {incident.threatLevel}
                                    </span>
                                </td>
                                {/* добавили стиль для статуса */}
                                <td style={{ padding: '12px', ...getStatusStyle(incident.status) }}>
                                    {incident.status}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <Link to={`/edit/${incident.id}`} style={{ marginRight: '10px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                                        ✎ Изменить
                                    </Link>
                                    <button onClick={() => handleDelete(incident.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold' }}>
                                        🗑 Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default IncidentList;
