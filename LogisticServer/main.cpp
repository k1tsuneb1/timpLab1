#include<iostream>
#include<vector>
#include<string>
#include"httplib.h" //для поднятия веб-сервера
#include"json.hpp" //для работы с json
#include <algorithm> //для remove_if
#include <ctime>   // для работы с датой и временем
#include <iomanip> //для форматирования даты и времени

using namespace std;
using json = nlohmann::json;

//сущность - инцедент 
struct Incident {
    string id;
    string description; //описание 
    string threatLevel; //уровень угрозы
    string detailedDescription; //подробное описание
    string status; //статус
    string date; //дата
};

//бд
vector<Incident> db = {
    {"1", "Сбой ГПС-трекера","Средний", "На шоссе 34", "Открыт", "2023-10-25 14:30:00"},
    {"2", "Прокол колеса", "Низкий", "Около завода им. Ленина", "В работе",  "2023-10-26 09:15:00"}
};

//для получения текущей даты и времени в формате "YYYY-MM-DD HH:MM:SS"
string getCurrentDate() {
    auto t = time(nullptr);
    auto tm = *localtime(&t);
    ostringstream oss;
    oss << put_time(&tm, "%Y-%m-%d %H:%M:%S");
    return oss.str();
}

//для React-приложению
void setCorsHeaders(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

int main(){
    httplib::Server svr; //создаём объект сервера

    //GET пинг
    svr.Get("/ping", [](const httplib::Request& req, httplib::Response& res){
        res.set_content("Сервер работает.", "text/plain; charset=utf-8");
    });

    //GET список инцидентов
    svr.Get("/api/incidents", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);
        json jsonArray = json::array();
        for(const auto& incident : db){
            jsonArray.push_back({
                {"id", incident.id},
                {"description", incident.description},
                {"detailedDescription", incident.detailedDescription},
                {"threatLevel", incident.threatLevel},
                {"status", incident.status},
                {"date", incident.date}
            });
        }
        res.set_content(jsonArray.dump(), "application/json; charset=utf-8");
    });

    svr.Options("/api/incidents", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);
        res.status = 200; //ОК
    });

    svr.Post("/api/incidents", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);
        try{
            auto body = json::parse(req.body);
            string newID = to_string(db.size() + 1);
            Incident newIncident;
            newIncident.id = newID;
            newIncident.description = body["description"];
            newIncident.detailedDescription = body["detailedDescription"];
            newIncident.threatLevel = body["threatLevel"];
            newIncident.status = body["status"];
            newIncident.date = getCurrentDate(); // СТАВИМ ТЕКУЩУЮ ДАТУ

            db.push_back(newIncident);

            json responseJson = {
                {"id", newID},
                {"message", "Инцидент добавлен."}
            };
            res.status = 201;
            res.set_content(responseJson.dump(), "application/json; charset=utf-8");
        } catch (const exception& err){
            res.status = 400;
            res.set_content(R"({"error": "Неверный формат данных JSON"})", "application/json; charset=utf-8");
        }
    });

    svr.Put(R"(/api/incidents/(\d+))", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);

        string idToUpdate = req.matches[1]; //id из URL

        try{
            auto body = json::parse(req.body); //id из URL

            bool found = false;
            
            //перезаписываем данные инцидента с этим id в бд
            for(auto& includes : db){
                if (includes.id == idToUpdate){
                    includes.description = body["description"];
                    includes.detailedDescription = body["detailedDescription"];
                    includes.threatLevel = body["threatLevel"];
                    includes.status = body["status"];
                    found = true;
                    break;
                }
            }
            if (!found) {
                res.status = 404; //не найдено
                res.set_content(R"({"error": "Инцидент не найден."})", "application/json; charset=utf-8");
            }
        } catch (const exception& err) {
            res.status = 400; //неверный запрос
            res.set_content(R"({"error": "Неверный формат данных JSON"})", "application/json; charset=utf-8");
        }
    });

    svr.Delete(R"(/api/incidents/(\d+))", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);

        //ловим id из URL который попал в скобки (\d+)
        string idToDelete = req.matches[1]; //id из URL

        //удаляем инцидент с этим id из бд
        auto it = remove_if(db.begin(), db.end(), [&](const Incident& incident){
            return incident.id == idToDelete;
        });

        if(it != db.end()){
            db.erase(it, db.end()); //удаляем все элементы от найденного итератора до конца вектора
            res.status = 200; //ОК
            res.set_content(R"({"message": "Инцидент удалён."})", "application/json; charset=utf-8");
        } else {
            res.status = 404; //не найдено
            res.set_content(R"({"error": "Инцидент не найден."})", "application/json; charset=utf-8");
        }
    });

    svr.Options(R"(/api/incidents/(\d+))", [](const httplib::Request& req, httplib::Response& res){
        setCorsHeaders(res);
        res.status = 200; //ОК
    });

    cout << "Сервер запущен на http://localhost:8080" << endl;

    svr.listen("0.0.0.0", 8080); //порт, который слушает сервер
}