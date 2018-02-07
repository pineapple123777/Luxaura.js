const fse = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const pug = require('pug');
const { promisify } = require('util')
const marked = require('marked')
const frontMatter = require('front-matter')
const globP = promisify(require('glob'))
const config = require('../site.config')

const ejsRenderFile = promisify(ejs.renderFile)
const distPath = './site'

// clear destination folder
fse.emptyDirSync(distPath)

// copy static folder
fse.copy(`static`, `${distPath}`)

// read pages
globP('**/*.@(md|ejs|html)', { cwd: `content` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      // create destination directory
      fse.mkdirs(destPath)
        .then(() => {
          // read page file
          return fse.readFile(`content/${file}`, 'utf-8')
        })
        .then((data) => {
          // render page
          const pageData = frontMatter(data)
          const templateConfig = Object.assign({}, config, { page: pageData.attributes })
          let pageContent

          // generate page content according to file type
          switch (fileData.ext) {
            case '.md':
              pageContent = ejs.render(marked(pageData.body), templateConfig)
              break
            case '.ejs':
              pageContent = ejs.render(pug.render(pageData.body), templateConfig)
              break
            default:
              pageContent = pug.render(ejs.render(pageData.body, templateConfig))
          }

          // render layout with page contents
          const layout = pageData.attributes.layout || 'default'

          return ejsRenderFile(`views/${layout}.ejs`, Object.assign({}, templateConfig, { body: pageContent }))
        })
        .then((str) => {
          // save the html file
          fse.writeFile(`${destPath}/${fileData.name}.html`, str)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })
