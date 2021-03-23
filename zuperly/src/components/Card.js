import "../styles/Card.css";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import CardEditor from "./CardEditor";
import { CHANGE_CARD_TEXT, DELETE_CARD } from '../redux/actionTypes/actionType'
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '500px',
    width: '500px'
  }
};


class Card extends Component {
  state = {
    hover: false,
    editing: false
  };

  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      text: this.props.card.text,
      modalIsOpen: false
    });

  endEditing = () => this.setState({ hover: false, editing: false });

  editCard = text => {
    const { card, dispatch } = this.props;

    this.endEditing();

    dispatch({
      type: CHANGE_CARD_TEXT,
      payload: { cardId: card._id, cardText: text }
    });
  };

  deleteCard = () => {
    const { listId, card, dispatch } = this.props;

    if (window.confirm("Are you sure to delete this card?")) {
      dispatch({
        type: DELETE_CARD,
        payload: { cardId: card._id, listId }
      });
    }
  };

  // modal
  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { card, index } = this.props;
    const { hover, editing } = this.state;

    if (!editing) {
      return (
        <>
          {
            card &&
            <>
              <Draggable draggableId={card._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="Card"
                    onMouseEnter={this.startHover}
                    onMouseLeave={this.endHover}
                  >
                    {hover && (
                      <div className="Card-Icons">
                        <div className="Card-Icon" onClick={this.startEditing}>
                          <ion-icon name="create" />
                        </div>
                      </div>
                    )}
                    <span onClick={this.openModal}>{card.text}</span>
                  </div>
                )}
              </Draggable>
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                TITLE : {card.text}
              </Modal>
            </>
          }
        </>
      );
    } else {
      return (
        <CardEditor
          text={card.text}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId]
});

export default connect(mapStateToProps)(Card);
