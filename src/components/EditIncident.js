import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

function EditIncident() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. ДОБАВИЛИ НОВОЕ СОСТОЯНИЕ ДЛЯ ПОДРОБНОГО ОПИСАНИЯ
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState(''); // <--- Новое
    const [threatLevel, setThreatLevel] = useState('Низкий');
    const [status, setStatus] = useState('Открыт');
    const [loading, setLoading] = useState(true);

    // 2. ПОДГРУЖАЕМ ДАННЫЕ С СЕРВЕРА
    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8080/api/incidents');
                const incident = response.data.find(inc => inc.id === id);
                
                if (incident) {
                    setDescription(incident.description);
                    // ЗАПОЛНЯЕМ НОВОЕ ПОЛЕ ИЗ ОТВЕТА СЕРВЕРА
                    setDetailedDescription(incident.detailedDescription || ''); 
                    setThreatLevel(incident.threatLevel);
                    setStatus(incident.status);
                }
            } catch (error) {
                console.error("Ошибка при загрузке:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id]);

    // 3. ОТПРАВЛЯЕМ ОБНОВЛЕННЫЕ ДАННЫЕ (PUT)
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8080/api/incidents/${id}`, {
                description,
                detailedDescription, // <--- ОТПРАВЛЯЕМ ПОДРОБНОСТИ НА СЕРВЕР
                threatLevel,
                status
            });
            alert("Изменения сохранены!");
            navigate(`/incident/${id}`); // Возвращаемся на страницу деталей, чтобы увидеть результат
        } catch (error) {
            console.error("Ошибка при обновлении:", error);
            alert("Не удалось сохранить изменения.");
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Загрузка...</div>;

    return (
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Редактирование инцидента №{id}</h2>
            
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Краткий заголовок:</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                {/* --- НОВОЕ ПОЛЕ ВВОДА ДЛЯ ПОДРОБНОГО ОПИСАНИЯ --- */}
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Подробное описание происшествия:</label>
                    <textarea 
                        value={detailedDescription} 
                        onChange={(e) => setDetailedDescription(e.target.value)} 
                        placeholder="Опишите все детали здесь..."
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc', 
                            minHeight: '150px', 
                            fontFamily: 'inherit',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Уровень угрозы:</label>
                        <select 
                            value={threatLevel} 
                            onChange={(e) => setThreatLevel(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Низкий">Низкий</option>
                            <option value="Средний">Средний</option>
                            <option value="Высокий">Высокий</option>
                            <option value="Критический">Критический</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Статус:</label>
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="Открыт">Открыт</option>
                            <option value="В работе">В работе</option>
                            <option value="Закрыт">Закрыт</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Link to={`/incident/${id}`} style={{ textDecoration: 'none', color: '#666', alignSelf: 'center' }}>
                        Отмена
                    </Link>
                    <button type="submit" style={{ 
                        padding: '12px 25px', 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold' 
                    }}>
                        Сохранить изменения
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditIncident;
