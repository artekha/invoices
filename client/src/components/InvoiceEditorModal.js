import React, { Component } from 'react';

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Input
} from 'reactstrap';

class InvoiceEditorModal extends Component {
  state = {
    data: []
  }

  componentWillMount() {
    const p = this.props;
    let isSelected = null;
    const filteredData = p.data.filter(dataItem => {
      if (p.headline === 'customer') {
        isSelected = [p.selectedData]
          .find(selectedDataItem => selectedDataItem.customer_id === dataItem.id);
      }
      if (p.headline === 'products') {
        isSelected = p.selectedData
          .find(selectedDataItem => selectedDataItem.product_id === dataItem.id);
      }
      if (!isSelected) {
        return dataItem;
      }
      return false;
    });
    this.setState({ data: filteredData });
  }

  filterList = e => {
    const updatedList = this.props.data.filter(item => {
      return item.name.toLowerCase()
        .search(e.target.value.toLowerCase()) !== -1;
    })
    this.setState({ data: updatedList });
  }

  render() {
    const {
      isOpen,
      onToggleClick,
      headline,
      items,
      selectItem
    } = this.props;
    return (
      <div>
        <Modal isOpen={isOpen} toggle={onToggleClick}>
          <ModalHeader toggle={onToggleClick}>Select {headline}</ModalHeader>
          <ModalBody>
            <Input placeholder="Type to filter" onChange={this.filterList}></Input>
            <Table hover size="sm" bordered className="text-center">
              <thead>
                <tr>
                  {items.map((headlineItem, index) => (
                    <th key={`headline-item${index}`}>{headlineItem}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.state.data.map((dataItem, index) => (
                  <tr
                    key={`data-item-${index}`}
                    onClick={selectItem.bind(this, dataItem)}
                    >
                    {items.map((dataKey, index) => (
                      <td key={`data-key-${index}`}>{dataItem[dataKey]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="secondary" onClick={onToggleClick}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default InvoiceEditorModal;
