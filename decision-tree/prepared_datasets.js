import {readDataset, reset} from './settings.js'

const preparedDatasets =[
    "Солнце,Температура,Влажность,Ветер,Игра состоится\n" +
    "Солнечно,Жарко,Высокая,Нет,Нет\n" +
    "Солнечно,Жарко,Высокая,Да,Да\n" +
    "Переменная облачность,Жарко,Высокая,Нет,Да\n" +
    "Пасмурно,Умеренно,Высокая,Нет,Да\n" +
    "Пасмурно,Прохладно,Нормальная,Нет,Да\n" +
    "Пасмурно,Прохладно,Нормальная,Да,Нет\n" +
    "Переменная облачность,Прохладно,Нормальная,Да,Да\n" +
    "Солнечно,Умеренно,Высокая,Нет,Нет\n" +
    "Солнечно,Прохладно,Нормальная,Нет,Да\n" +
    "Пасмурно,Умеренно,Нормальная,Нет,Да\n" +
    "Солнечно,Умеренно,Нормальная,Да,Да\n" +
    "Переменная облачность,Умеренно,Высокая,Да,Да\n" +
    "Переменная облачность,Жарко,Нормальная,Нет,Да\n" +
    "Пасмурно,Умеренно,Высокая,Да,Нет\n",

    "CGPA,Interactive,Practical Knowledge,Comm Skills,Job Offer\n" +
    ">=9,Yes,Very good,Good,Yes\n" +
    ">=8,No,Good,Moderate,Yes\n" +
    ">=9,No,Average,Poor,No\n" +
    "<8,No,Average,Good,No\n" +
    ">=8,Yes,Good,Moderate,Yes\n" +
    ">=9,Yes,Good,Moderate,Yes\n" +
    "<8,Yes,Good,Poor,No\n" +
    ">=9,No,Very good,Good,Yes\n" +
    ">=8,Yes,Good,Good,Yes\n" +
    ">=8,Yes,Average,Good,Yes\n"
]


const selectDataset = document.getElementById('select-dataset');
selectDataset.addEventListener('change', function() {
    reset();
    switch(selectDataset.value) {
        case "":
            alert("Куда жмешь?");
            break
        case "first":
            readDataset(preparedDatasets[0].split("\n"));
            break;
        case "second":
            readDataset(preparedDatasets[1].split("\n"));
            break;
    }
});