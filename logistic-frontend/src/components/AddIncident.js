import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AddIncident() {
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [threatLevel, setThreatLevel] = useState('Низкий');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8080/api/incidents', {
                description,
                detailedDescription,
                threatLevel,
                status: 'Открыт'
            });
            navigate('/');
        } catch (error) {
            console.error("Ошибка при добавлении:", error);
            alert("Не удалось добавить инцидент.");
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>Регистрация нового инцидента</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ fontWeight: 'bold' }}>Краткий заголовок:</label>
                    <input 
                        type="text" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Подробное описание:</label>
                    <textarea 
                        value={detailedDescription} 
                        onChange={(e) => setDetailedDescription(e.target.value)} 
                        style={{ width: '100%', padding: '8px', minHeight: '100px', boxSizing: 'border-box', marginTop: '5px' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Уровень угрозы:</label>
                    <select 
                        value={threatLevel} 
                        onChange={(e) => setThreatLevel(e.target.value)} 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '5px' }}
                    >
                        <option value="Низкий">Низкий</option>
                        <option value="Средний">Средний</option>
                        <option value="Высокий">Высокий</option>
                        <option value="Критический">Критический</option>
                    </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#666', padding: '10px' }}>Отмена</Link>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Зафиксировать
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddIncident;
