import * as gutil from 'gulp-util'
import * as path from 'path'
import * as through2 from 'through2'
import * as Vinyl from 'vinyl'
import * as _ from 'lodash'
import * as fs from 'fs'

const pluginName = 'gulp-component-menu-behaviors'
const extract = require('extract-comments')
const doctrine = require('doctrine')

export default () => {
  const result = []

  function bufferContents(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file)
      return
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(pluginName, 'Streaming is not supported'))
      return
    }

    try {
      const absPath = path.resolve(process.cwd(), file.path)
      const dir = path.dirname(absPath)
      const componentType = path.basename(path.dirname(dir)).replace(/s$/, '')
      const behaviorVariantName = file.basename
      const behaviorName = path.basename(dir)

      let description
      const fileContent = fs.readFileSync(file.path).toString()
      const blockComments = extract(fileContent).filter(comment => comment.type === 'BlockComment') // filtering only block comments

      // getting object that describes '@description' part of the comment's text
      if (!_.isEmpty(blockComments)) {
        const commentTokens = doctrine.parse(blockComments[0].raw, { unwrap: true }).tags
        const descriptionToken = commentTokens.find(token => token.title === 'description')
        description = descriptionToken.description
      } else {
        description = 'Behavior file has no description.'
      }

      result.push({
        displayName: behaviorName,
        type: componentType,
        variations: {
          name: behaviorVariantName,
          text: description,
        },
      })
      cb()
    } catch (err) {
      const pluginError = new gutil.PluginError(pluginName, err)
      const relativePath = path.relative(process.cwd(), file.path)
      pluginError.message = [
        gutil.colors.magenta(`Error in file: ${relativePath}`),
        gutil.colors.red(err.message),
        gutil.colors.gray(err.stack),
      ].join('\n\n')
      this.emit('error', pluginError)
    }
  }

  function getParsedResults() {
    return _(result)
      .groupBy('displayName')
      .map((behaviors, displayName) => ({
        displayName,
        type: behaviors[0].type,
        variations: _.map(behaviors, 'variations'),
      }))
      .value()
  }

  function endStream(cb) {
    const file = new Vinyl({
      path: './componentMenuBehaviors.json',
      contents: Buffer.from(JSON.stringify(getParsedResults(), null, 2)),
    })

    this.push(file)
    cb()
  }

  return through2.obj(bufferContents, endStream)
}