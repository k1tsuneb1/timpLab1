import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function IncidentDetails() {
    const { id } = useParams(); // Достаем ID из адресной строки
    const navigate = useNavigate();
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                //(обновлено) получаем конкретный инцидент по ID
                const response = await axios.get(`http://127.0.0.1:8080/api/incidents/${id}`);
                setIncident(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке инцидента:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Удалить этот инцидент?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8080/api/incidents/${id}`);
            navigate('/'); //после удаления возвращаем на главную
        } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Не удалось удалить.");
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;
    if (!incident) return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Инцидент не найден.</div>;

    //вспомогательные функции для стилей
    const getThreatColor = (level) => {
        switch(level) {
            case 'Низкий': return '#28a745'; case 'Средний': return '#ffc107'; 
            case 'Высокий': return '#fd7e14'; case 'Критический': return '#dc3545'; default: return '#333';
        }
    };
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Открыт': return { color: '#dc3545', fontWeight: 'bold' };
            case 'В работе': return { color: '#007bff', fontWeight: 'bold' };
            case 'Закрыт': return { color: '#28a745', fontWeight: 'bold' }; default: return {};
        }
    };

    return (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Детали инцидента №{incident.id}</h2>
                <span style={{ fontSize: '14px', color: '#666' }}>{incident.date || 'Дата не указана'}</span>
            </div>

            <div style={{ marginBottom: '25px', lineHeight: '1.6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Описание:</h4>
                <p style={{ margin: 0, fontSize: '18px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #007bff' }}>
                    {incident.description}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Уровень угрозы:</h4>
                    <span style={{ backgroundColor: getThreatColor(incident.threatLevel), color: 'white', padding: '6px 12px', borderRadius: '15px', fontWeight: 'bold' }}>
                        {incident.threatLevel}
                    </span>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Текущий статус:</h4>
                    <span style={{ fontSize: '16px', ...getStatusStyle(incident.status) }}>
                        {incident.status}
                    </span>
                </div>
            </div>
            <div style={{ marginBottom: '25px', lineHeight: '1.6' }}>
                <h3 style={{ color: '#007bff', marginBottom: '5px' }}>{incident.description}</h3>
                <hr />
                <h4 style={{ margin: '15px 0 5px 0', color: '#555' }}>Подробная информация:</h4>
                <p style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    whiteSpace: 'pre-wrap', //чтобы сохранялись переносы строк
                    backgroundColor: '#fff', 
                    padding: '20px', 
                    borderRadius: '6px', 
                    border: '1px solid #eee' 
                }}>
                    {incident.detailedDescription || "Подробное описание отсутствует."}
                </p>
            </div>

            {/* Кнопки действий */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                <Link to="/" style={{ color: '#6c757d', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    ← Назад к списку
                </Link>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/edit/${incident.id}`} style={{ padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        ✎ Изменить
                    </Link>
                    <button onClick={handleDelete} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🗑 Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IncidentDetails;
