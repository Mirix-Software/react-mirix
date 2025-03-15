module.exports = {
    prompter(cz, commit) {
        cz.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Выберите тип коммита:',
                choices: [
                    {
                        name: 'feat: Добавление нового функционала',
                        value: 'feat',
                    },
                    { name: 'fix: Исправление ошибки', value: 'fix' },
                    { name: 'docs: Изменения в документации', value: 'docs' },
                    {
                        name: 'style: Изменения, не влияющие на код (форматирование, пробелы и т.п.)',
                        value: 'style',
                    },
                    {
                        name: 'refactor: Изменения в коде, не исправляющие баги и не добавляющие функционал',
                        value: 'refactor',
                    },
                    {
                        name: 'perf: Изменения для улучшения производительности',
                        value: 'perf',
                    },
                    {
                        name: 'test: Добавление или исправление тестов',
                        value: 'test',
                    },
                    {
                        name: 'build: Изменения, влияющие на сборку проекта или зависимости',
                        value: 'build',
                    },
                    { name: 'ci: Изменения в конфигурации CI/CD', value: 'ci' },
                    { name: 'chore: Прочие изменения', value: 'chore' },
                    {
                        name: 'revert: Отмена предыдущего коммита',
                        value: 'revert',
                    },
                ],
            },
            {
                type: 'input',
                name: 'scope',
                message:
                    'Укажите область (например, компонент или модуль), если применимо (или оставьте пустым):',
            },
            {
                type: 'input',
                name: 'subject',
                message: 'Введите краткое описание:',
                validate: (input) =>
                    input ? true : 'Описание не может быть пустым',
            },
            {
                type: 'input',
                name: 'body',
                message: 'Введите подробное описание (необязательно):',
            },
        ]).then((answers) => {
            const scope = answers.scope ? `(${answers.scope.trim()})` : '';
            const header = `${answers.type}${scope}: ${answers.subject.trim()}`;
            const body = answers.body ? `\n\n${answers.body.trim()}` : '';
            const commitMessage = header + body;
            commit(commitMessage);
        });
    },
};
