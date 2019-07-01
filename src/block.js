const { InspectorControls, InnerBlocks } = wp.blockEditor;
const { registerBlockType } = wp.blocks;
const { PanelBody, Button, TextControl, SelectControl, RangeControl } = wp.components;
const { Fragment, createElement } = wp.element;
const { __ } = wp.i18n;

const iconEl = createElement('svg', { width: 20, height: 20, viewBox: "0 0 241.95 283.46" },
  createElement('path', { d: "M41.51,41.51,61.56,61.56a113.38,113.38,0,0,1,160.35,0l20-20.05A141.73,141.73,0,0,0,41.51,41.51 M41.51,41.51,61.56,61.56a113.38,113.38,0,0,0,0,160.35L41.51,242A141.73,141.73,0,0,1,41.51,41.51Z M242,242l-20-20a113.38,113.38,0,0,1-160.35,0L41.51,242A141.73,141.73,0,0,0,242,242Z", fill: "#303030"})
);

//import column-block
import './slide.js';

const ALLOWED_BLOCKS = [ 'chrisf/slide-block' ];

const getSlidesTemplate = (numSlides, currentSlide) => {
  let els = [];
  for( let x = 0; x<numSlides; x++ ){
    let isCurrentSlide = ( x == 0 ) ? 1 : 0 ;
    els.push([ 'chrisf/slide-block', { slideNumber: (x + 1), isCurrentSlide: isCurrentSlide } ])
  }
  return els;
}

import './style.scss';
import './editor.scss';

registerBlockType('chrisf/image-slider-block', {
  title: 'Image Slider Block',
  icon: iconEl,
  category: 'common',
  attributes: {
    numSlides: {
      type: 'integer',
      default: 1
    },
    containerId: {
      type: 'string',
      default: null
    },
    currentSlide: {
      type: 'integer',
      default: 1
    },
    supports: {
  		align: [ 'wide', 'full' ]
  	},
  },

  edit( {attributes, className, setAttributes, clientId } ) {

    console.log(attributes);

    //set current slide attributes on children
    let children = wp.data.select('core/editor').getBlocksByClientId(clientId)[0].innerBlocks;
    children.forEach( function( child, index ){
      //check if current
      if( index == (attributes.currentSlide - 1)){
        wp.data.dispatch('core/editor').updateBlockAttributes(child.clientId, {isCurrentSlide: 1})
      } else {
        wp.data.dispatch('core/editor').updateBlockAttributes(child.clientId, {isCurrentSlide: 0})
      }
    })

    //current slide actions
    if( attributes.currentSlide > attributes.numSlides ){
      setAttributes({ currentSlide: 1 })
    }
    if( attributes.currentSlide < 1 ){
      setAttributes({ currentSlide: attributes.numSlides })
    }
    const imageSliderClasses = 'image-slider-editor show-' + attributes.currentSlide;

    const getSlideOptions = function(){
      let options = [];
      for( let x = 0; x < attributes.numSlides; x++ ){
        options.push({
          value: (x + 1),
          label: 'Slide ' + (x + 1)
        })
      }
      return options;
    }

    return[
      <InspectorControls>
        <PanelBody>
          <TextControl
            label="Number of slides"
            value={ attributes.numSlides }
            type="number"
            onChange={ nextSlides => setAttributes({ numSlides: parseInt(nextSlides, 10) }) }
            min={ 1 }
            max={ 16 }
          />
        </PanelBody>
        <PanelBody>
        <SelectControl
          onChange={ slideIndex => setAttributes({ currentSlide: slideIndex })}
          // Selected value.
          value={ attributes.currentSlide }
          label={ __( 'Select slide number to view/edit' ) }
          options={ getSlideOptions() } />
        </PanelBody>
        <PanelBody>
          <TextControl
            label='Container ID'
            value={ attributes.containerId }
            onChange={ (value) => setAttributes({ containerId: value })}
          />
        </PanelBody>
      </InspectorControls>,
      <Fragment>
        <div className={ imageSliderClasses }>
          <InnerBlocks
            template={ getSlidesTemplate( attributes.numSlides, attributes.currentSlide ) }
            templateLock="all"
            allowedBlocks={ ALLOWED_BLOCKS } />
        </div>
        <button onClick={ () => { setAttributes({ currentSlide: ( attributes.currentSlide - 1 ) }) } }>Prev slide</button>
        <button onClick={ () => { setAttributes({ currentSlide: ( attributes.currentSlide + 1 ) }) } }>Next slide</button>
      </Fragment>
    ]
  },


  save( { attributes } ) {

    return <section className="image-slider"><InnerBlocks.Content /></section>;
  },

});
