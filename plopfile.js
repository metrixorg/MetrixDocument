const packageJson = require('./package.json');

module.exports = function(plop) {
  plop.setHelper('kebabWithSlash', text => {
    const result = (text.endsWith('/') ? text.substring(0, text.length - 1) : text)
      .split('/')
      .map(str => {
        return str
          .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          .map(x => x.toLowerCase())
          .join('-');
      })
      .join('/');
    return result;
  });

  plop.setGenerator('markdown-page', {
    description: 'Adds a page to the website',
    prompts: [
      {
        name: 'path',
        type: 'input',
        message: 'Enter the route in which your page should be displayed:',
        transformer: input => `${packageJson.homepage}${input}`,
      },
      {
        name: 'faTitle',
        type: 'input',
        message: 'Title of the article in Persian:',
      },
      {
        name: 'hasEnglish',
        type: 'confirm',
        message: 'Do you want to also create the english version of the page?',
        default: false,
      },
      {
        name: 'enTitle',
        type: 'input',
        message: 'Title of the article in English:',
        when: data => data.hasEnglish,
      },
    ],
    actions: data => {
      const actionMarkdownFile = lang => ({
        type: 'add',
        path: `src/jekyll/docs/{{kebabWithSlash path}}/index-${lang}.md`,
        templateFile: 'plop-templates/markdown-page.hbs',
        data: { lang, title: lang === 'fa' ? data.faTitle : data.enTitle },
      });
      const actions = [actionMarkdownFile('fa')].concat(data.hasEnglish ? [actionMarkdownFile('en')] : []);
      return actions;
    },
  });
};
