const { InspectorControls, InnerBlocks, RichText, MediaUpload, PlainText, ColorPalette } = wp.editor;
const { PanelBody, Button, RangeControl } = wp.components;
const { Fragment, createElement } = wp.element;
const { registerBlockType } = wp.blocks;

const iconEl = createElement('svg', { width: 20, height: 20, viewBox: "0 0 241.95 283.46" },
  createElement('path', { d: "M41.51,41.51,61.56,61.56a113.38,113.38,0,0,1,160.35,0l20-20.05A141.73,141.73,0,0,0,41.51,41.51 M41.51,41.51,61.56,61.56a113.38,113.38,0,0,0,0,160.35L41.51,242A141.73,141.73,0,0,1,41.51,41.51Z M242,242l-20-20a113.38,113.38,0,0,1-160.35,0L41.51,242A141.73,141.73,0,0,0,242,242Z", fill: "#303030"})
);

const convertHexToRgba = function (hex, opacity) {
  hex = hex.replace('#','');
  let red = parseInt(hex.substring(0,2), 16);
  let green = parseInt(hex.substring(2,4), 16);
  let blue = parseInt(hex.substring(4,6), 16);
  let result = 'rgba('+red+','+green+','+blue+','+opacity/100+')';
  return result;
}

const getImageSource = function ( imageUrl ) {
  if(imageUrl) {
    return(
      imageUrl
    );
  } else {
    return 'https://source.unsplash.com/random/800x600'
  }
}

export default registerBlockType('chrisf/slide-block', {
  title: 'Slide Block',
  parent: 'chrisf/image-slider-block',
  icon: iconEl,
  category: 'common',
  attributes: {
    imageAlt: {
      attribute: 'alt',
      selector: 'img'
    },
    imageUrl: {
      attribute: 'src',
      selector: 'img'
    },
    overlayColor: {
      type: 'string'
    },
    overlayOpacity: {
      type: 'integer',
      default: 100
    },
    primaryFontColor: {
      type: 'string'
    },
    isCurrentSlide: {
      type: 'integer',
      default: 0
    },
    slideNumber: {
      type: 'integer',
      default: 0
    }
  },

  edit({ attributes, setAttributes }) {

    const getImageButton = ( openEvent ) => {
      if(attributes.imageUrl) {
        return (
          <Button
            onClick={ openEvent }
            className="button button-large"
          >
            Change image
          </Button>
        );
      } else {
        return (
          <Button
            onClick={ openEvent }
            className="button button-large"
          >
            Choose slide background image
          </Button>
        );
      }
    }

    const styles={
      backgroundImage: 'url(' + getImageSource( attributes.imageUrl ) + ')'
    }
    //if overlay
    if( attributes.overlayColor ){
      let bgColorRgba = convertHexToRgba( attributes.overlayColor, attributes.overlayOpacity );
      styles.backgroundColor = bgColorRgba;
      styles.backgroundBlendMode = 'overlay';
    }
    //if font color
    if( attributes.primaryFontColor ){
      styles.color = attributes.primaryFontColor;
    }
    //show/hide
    if( attributes.isCurrentSlide > 0 ){
      styles.display = 'inline-block';
    }


    return[
      <InspectorControls>
        <PanelBody>
          <MediaUpload
          onSelect={ media => { setAttributes({ imageAlt: media.alt, imageUrl: media.url }); } }
          type="image"
          value={ attributes.imageID }
          render={ ({ open }) => getImageButton(open) }
          />
        </PanelBody>
        <PanelBody>
          <label>Overlay Colour</label>
          <ColorPalette
              value={ attributes.overlayColor }
              onChange={ color => setAttributes({ overlayColor: color })}
            />
          <RangeControl
            label="Overlay opacity"
            value={ attributes.overlayOpacity }
            initialPosition={ attributes.overlayOpacity }
            onChange={ value => setAttributes({ overlayOpacity: value }) }
            min={ 1 }
            max={ 100 }
          />
        </PanelBody>
        <PanelBody>
          <label>Choose primary font color:</label>
          <ColorPalette
            value={ attributes.primaryFontColor }
            onChange={ color => setAttributes({ primaryFontColor: color })}
          />
        </PanelBody>
      </InspectorControls>,
      <div className={'slide slide-' + attributes.slideNumber } style={ styles }>
        <InnerBlocks templateLock={ false } />
      </div>
    ]
  },


  save({ attributes }) {

    const styles={
      backgroundImage: 'url(' + getImageSource( attributes.imageUrl ) + ')'
    }
    //if overlay
    if( attributes.overlayColor ){
      let bgColorRgba = convertHexToRgba( attributes.overlayColor, attributes.overlayOpacity );
      styles.backgroundColor = bgColorRgba;
      styles.backgroundBlendMode = 'overlay';
    }
    //if font color
    if( attributes.primaryFontColor ){
      styles.color = attributes.primaryFontColor;
    }

    //inout checked
    let checked = ( attributes.slideNumber === 1 ) ? true : false ;

    return (
      <Fragment>
        <input type="radio" name="select-slide" id={ 'slide-' + attributes.slideNumber } checked={ checked } value={attributes.slideNumber} />
        <label for={ 'slide-' + attributes.slideNumber }></label>
        <div className="slide" style={ styles }>
          <InnerBlocks.Content />
        </div>
      </Fragment>
    )
  }


});
