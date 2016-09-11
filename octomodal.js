import React from 'react';

export default class OctoModal extends React.Component {
    static defaultProps = {
        container: document.body,
        gallery: false,
        classes: []
    };

    state = {
        shown: false,
        closeButton: true,
        closeOnOverlay: true,
        isGallery: false,
        gallery: this.props.gallery,
        galleryPosition: 0,
        imageLoading: false,
        content: null,
        classes: this.props.classes
    };

    componentWillMount() {
        //onEvent('show-modal', this.show);
        //onEvent('hide-modal', this.hide);

        if (this.props.gallery) {
            this.props.gallery.forEach((element, index) => {
                element.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.showGalleryImage(index);
                });
            });
        }
    }

    show = (content, settings = {}) => {
        const nextState = Object.assign(settings, {
            shown: true,
            isGallery: false,
            content: content
        });

        this.setState(nextState);
    };

    hide = () => {
        this.setState({
            shown: false
        });
    };

    showGalleryImage = (index) => {
        this.setState({
            shown: true,
            isGallery: true,
            galleryPosition: index,
            content: null,
            imageLoading: true
        });
    };

    galleryPrevious = () => {
        const lastPosition = this.state.gallery.length - 1;
        const index = (this.state.galleryPosition === 0) ? lastPosition : this.state.galleryPosition - 1;
        this.showGalleryImage(index);
    };

    galleryNext = () => {
        const lastPosition = this.state.gallery.length - 1;
        const index = (this.state.galleryPosition === lastPosition) ? 0 : this.state.galleryPosition + 1;
        this.showGalleryImage(index);
    };

    closeOnOverlay = (event) => {
        if (this.state.closeOnOverlay) {
            if (event.target.classList.contains('modal--close-on-overlay') || event.target.classList.contains('modal__wrapper')) {
                this.hide();
            }
        }
    };

    imageLoaded = () => {
        this.setState({
            imageLoading: false
        });
    };

    closeButton() {
        if (this.state.closeButton) {
            return (
                <div className="modal__close-button" onClick={this.hide}></div>
            );
        }
    }

    galleryButtons() {
        if (this.state.isGallery) {
            return (
                <div className="modal__controls">
                    <div className="modal__button modal__button--previous" onClick={this.galleryPrevious}></div>
                    <div className="modal__button modal__button--next" onClick={this.galleryNext}></div>
                </div>
            );
        }
    }

    getModalClasses() {
        const classes = [
            'modal'
        ];

        if (this.state.closeOnOverlay) {
            classes.push('modal--close-on-overlay');
        }

        if (this.state.isGallery) {
            classes.push('modal--gallery');
        }

        if (this.state.isGallery && this.state.imageLoading) {
            classes.push('modal--image-loading');
        }

        return classes.concat(this.state.classes).join(' ');
    }

    getContainer() {
        if (this.state.isGallery) {
            return <img src={this.state.gallery[this.state.galleryPosition].getAttribute('href')} alt="" className="modal__image" onClick={this.galleryNext} onLoad={this.imageLoaded} />;
        }

        return <div className="modal__container" dangerouslySetInnerHTML={{__html: this.state.content}} />;
    }

    render() {
        if (this.state.shown) {
            this.props.container.classList.add('modal-fix');

            return (
                <div className={this.getModalClasses()} onClick={this.closeOnOverlay}>
                    <div className="modal__wrapper">
                        {this.getContainer()}
                    </div>
                    {this.galleryButtons()}
                    {this.closeButton()}
                </div>
            );
        }

        this.props.container.classList.remove('modal-fix');

        return null;
    }
}
