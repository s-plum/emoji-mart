import React from 'react'
import PropTypes from 'prop-types'

export default class Anchors extends React.PureComponent {
  constructor(props) {
    super(props)

    let defaultCategory = props.categories.filter(
      (category) => category.first,
    )[0]

    this.state = {
      selected: defaultCategory.name,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    var index = e.currentTarget.getAttribute('data-index')
    var { categories, onAnchorClick } = this.props

    onAnchorClick(categories[index], index)
  }

  handleKeyUp() {
    return (e) => {
        var code = (e.keyCode ? e.keyCode : e.which)
        if(code == 13) {
          this.handleClick(e)
        }
    }
  }

  render() {
    var { categories, color, i18n, icons } = this.props,
      { selected } = this.state

    return (
      <nav className="emoji-mart-anchors" aria-label={i18n.categorieslabel}>
        {categories.map((category, i) => {
          var { id, name, anchor } = category,
            isSelected = name == selected

          if (anchor === false) {
            return null
          }

          const iconId = id.startsWith('custom-') ? 'custom' : id

          return (
            <button
              type="button"
              key={id}
              aria-label={i18n.categories[id]}
              title={i18n.categories[id]}
              data-index={i}
              onClick={this.handleClick}
              onKeyUp={this.handleKeyUp()}
              className={`emoji-mart-anchor ${
                isSelected ? 'emoji-mart-anchor-selected' : ''
              }`}
              style={{ color: isSelected ? color : null }}
            >
              <span className="emoji-mart-anchor-icon">
                {icons.categories[id]()}
              </span>
              <span
                className="emoji-mart-anchor-bar"
                style={{ backgroundColor: color }}
              />
            </button>
          )
        })}
      </nav>
    )
  }
}

Anchors.propTypes /* remove-proptypes */ = {
  categories: PropTypes.array,
  onAnchorClick: PropTypes.func,
  icons: PropTypes.object,
}

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: () => {},
  icons: {},
}
