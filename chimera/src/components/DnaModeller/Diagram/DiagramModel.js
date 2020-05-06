import DiagramNode from './DiagramNode'

var generateId = function () {
  return Math.trunc(Math.random() * 1000)
}

let anchorTypeIndex = 0

/**
 * @class DiagramModel
 */
class DiagramModel {
  /**
   */
  constructor () {
    this._model = {
      nodes: [],
      links: []
    }
  }

  /**
   * Adds a node to the diagram
   * @param {String} title  The title of the node
   * @param {Integer} x      X coordinate
   * @param {Integer} y      Y Coordinate
   * @param {Integer} width  Width
   * @param {Integer} height Height
   * @param {String} type  Anchor, Entry, Link
   * @return {Node} The node created
   */
  addNode (title, x, y, width, height, type, typeIndex, color) {
    const newNode = new DiagramNode(generateId(), title, x, y, width, height, type, typeIndex, color)
    this._model.nodes.push(newNode)
    return newNode
  }

  addRootAnchor (colOffset, yOffset, cardWidth, color) {
    const rootAnchorNode = this.addNode('anchor_type::root_anchor', colOffset, yOffset, cardWidth, 145, 'rootAnchor', 0, color)
    rootAnchorNode.addField('entry!|name:holochain::anchor')
    rootAnchorNode.addField('link!|from:holochain::anchor')
    rootAnchorNode.addField('link!|type:holochain::anchor_link')
    rootAnchorNode.addField('anchor_type|root_anchor')
    rootAnchorNode.addField('anchor_text')
    return rootAnchorNode.addOutPort('anchor_link')
  }

  addAnchorType (anchorType, rootAnchorPort, colOffset, yOffset, cardWidth, color) {
    const anchorTypeNode = this.addNode(`anchor_type::${anchorType.type}`, colOffset, yOffset, cardWidth, 165, 'anchorType', anchorTypeIndex, color)
    anchorTypeNode.addField('entry!|name:holochain::anchor')
    anchorTypeNode.addField('link!|from:holochain::anchor')
    anchorTypeNode.addField('link!|type:holochain::anchor_link')
    anchorTypeNode.addField(`anchor_type|${anchorType.type}`)
    anchorTypeNode.addField('anchor_text')
    anchorTypeIndex += 1
    const anchorTypeInPort = anchorTypeNode.addInPort('address()')
    this.addLink(rootAnchorPort, anchorTypeInPort, anchorType.type)
    return anchorTypeNode
  }

  addEntryType (zomeName, entryType, node, tag, context, colOffset, yOffset, cardWidth, entryTypeIndex, color) {
    const entityName = `${zomeName.toLowerCase().replace(' ', '_')}::${entryType.name.toLowerCase()}`
    const entryTypeNodeHeight = 125 + (entryType.fields.length + entryType.metaFields.length) * 20
    const entryTypeNode = this.addNode(entityName, colOffset, yOffset, cardWidth, entryTypeNodeHeight, 'entryType', entryTypeIndex, color)
    entryTypeNode.deletable = true
    entryTypeNode.addField(`entry!|${entityName}`)
    entryTypeNode.addField('link!|from:holochain::anchor')
    entryTypeNode.addField(`link!|type:${entryType.name.toLowerCase()}_link`)
    entryTypeNode.addField('unique|true')
    entryType.fields.forEach(field => {
      entryTypeNode.addField(`${field.fieldName}|${field.fieldType}`)
    })
    entryType.metaFields.forEach(metaField => {
      entryTypeNode.addMetaField(`${metaField.fieldName}|${metaField.fieldType}`)
    })
    const entryTypeOutPort = node.addOutPort(`${entryType.name.toLowerCase()}_link`)
    const entryTypeInPort = entryTypeNode.addInPort(`id:initial_${entryType.name.toLowerCase()}_entry_address`)
    this.addLink(entryTypeOutPort, entryTypeInPort, tag, context)
    return entryTypeNode
  }

  addAnchor (anchor, anchorTypeOutPort, colOffset, yOffset, cardWidth, anchorIndex, color) {
    const anchorNode = this.addNode(`anchor::${anchor.text}`, colOffset, yOffset, cardWidth, 165, 'anchor', anchorIndex, color)
    anchorNode.addField('entry!|name:holochain::anchor')
    anchorNode.addField('link!|from:holochain::anchor')
    anchorNode.addField('link!|type:holochain::anchor_link')
    anchorNode.addField(`anchor_type|${anchor.type}`)
    anchorNode.addField(`anchor_text|${anchor.text}`)
    const anchorInPort = anchorNode.addInPort('address()')
    this.addLink(anchorTypeOutPort, anchorInPort, anchor.text)
    return anchorNode
  }

  deleteNode (node) {
    if (confirm('Confirm you want to delete this Entity')) {
      const index = this._model.nodes.indexOf(node)
      for (var j = 0; j < this._model.links.length; j++) {
        const currentLink = this._model.links[j]
        for (var i = 0; i < node.ports.length; i++) {
          const currentPort = node.ports[i]
          if (
            currentLink.from === currentPort.id ||
            currentLink.to === currentPort.id
          ) {
            this.deleteLink(currentLink)
            j--
          }
        }
      }
      this._model.nodes.splice(index, 1)
    }
  }

  deleteLink (link) {
    const index = this._model.links.indexOf(link)
    this._model.links.splice(index, 1)
  }

  /**
   * Adds a link between two ports
   * @param {Integer} from   Port id. Must be an out port
   * @param {Integer} to     Port id. Must be an in port
   * @param {String}  tag  Optional. link tag
   * @param {Array}  points  Optional. Array of points to make the link represented as a segmented line
   */
  addLink (from, to, tag = '', context = '', points = []) {
    this._model.links.push({
      id: generateId(),
      from: from,
      to: to,
      tag: tag,
      context: context,
      positionFrom: {},
      positionTo: {},
      points
    })
  }

  /**
   * Serializes the diagram model into a JSON object
   * @return {Object} The diagram model
   */
  serialize () {
    return JSON.stringify(this._model)
  }

  /**
   * Load into the diagram model a serialized diagram
   * @param  {Object} serializedModel
   */
  deserialize (serializedModel) {
    this._model = JSON.parse(serializedModel)
  }
}

export default DiagramModel
