import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Хук для перехода на другую страницу после отправки

function AddIncident() {
    // 1. Создаем состояние для полей формы
    // Имена полей в объекте должны совпадать с тем, что ждет твой C++ сервер (description, threatLevel, status)
    const [description, setDescription] = useState('');
    const [threatLevel, setThreatLevel] = useState('Низкий');
    const [status, setStatus] = useState('Открыт');
    
    // Хук для навигации
    const navigate = useNavigate();

    // 2. Функция, которая сработает при нажатии кнопки "Добавить"
    const handleSubmit = async (e) => {
        e.preventDefault(); // Останавливаем стандартную перезагрузку страницы при отправке формы

        try {
            // Отправляем POST запрос к нашему C++ серверу. 
            // Обрати внимание на IP 127.0.0.1, раз он у нас заработал!
            await axios.post('http://127.0.0.1:8080/api/incidents', {
                description: description,
                threatLevel: threatLevel,
                status: status
            });
            
            // Если сервер ответил успешно (статус 201), переходим на главную страницу
            // где в списке должен появиться наш новый инцидент.
            navigate('/');
        } catch (error) {
            console.error("Ошибка при добавлении инцидента:", error);
            alert("Не удалось добавить инцидент. Проверь консоль разработчика (F12).");
        }
    };

    return (
        <div style={{ maxWidth: '400px' }}>
            <h2>Новый инцидент</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                
                <label>Описание происшествия:</label>
                <input 
                    type="text" 
                    placeholder="Например: Подозрительный шум на складе"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    style={{ padding: '8px' }}
                />

                <label>Уровень угрозы:</label>
                <select 
                    value={threatLevel} 
                    onChange={(e) => setThreatLevel(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="Низкий">Низкий</option>
                    <option value="Средний">Средний</option>
                    <option value="Высокий">Высокий</option>
                    <option value="Критический">Критический</option>
                </select>

                <label>Статус:</label>
                <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="Открыт">Открыт</option>
                    <option value="В работе">В работе</option>
                    <option value="Закрыт">Закрыт</option>
                </select>

                <button type="submit" style={{ 
                    padding: '10px', 
                    backgroundColor: '#4CAF50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>
                    Зафиксировать
                </button>
            </form>
        </div>
    );
}

export default AddIncident;
