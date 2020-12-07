import React, { Component } from "react";
import moduleList from "./module-list";

const modulesWithRef = moduleList.map((option) => {
  return { ...option, ref: React.createRef() };
});

export default class ModuleInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      filteredOptions: this.filterOptions(props.value),
      currentOption: 0,
      displayedInput: props.value,
    };
  }

  filterOptions = (input) => {
    return modulesWithRef.filter((module) => {
      return module.name.toUpperCase().indexOf(input.toUpperCase()) > -1;
    });
  };

  changeInput = (input) => {
    this.setState({
      filteredOptions: this.filterOptions(input),
      displayedInput: input,
    });
  };

  onClickInput = (e) => {
    this.setState({ showOptions: true });
  };

  onClickOption = (e) => {
    const option = e.target.id;
    this.props.onChange(this.state.filteredOptions[option].code);
    this.changeInput(this.state.filteredOptions[option].name);
    this.setState({
      currentOption: 0,
      showOptions: false,
    });
  };

  onChangeInput = (e) => {
    const input = e.target.value;
    this.changeInput(input);
    this.setState((prevState) => {
      return {
        currentOption: 0,
        showOptions: true,
      };
    });
  };

  onKeyDown = (e) => {
    if (this.state.filteredOptions.length > 0) {
      const key = e.keyCode;
      if (key === 13) {
        // enter
        e.preventDefault();
        const option = this.state.currentOption;
        this.props.onChange(this.state.filteredOptions[option].code);
        this.changeInput(this.state.filteredOptions[option].name);
        this.setState({ showOptions: false });
      } else if (key === 38 || key === 40) {
        // up || down
        e.preventDefault();
        this.setState((prevState) => {
          const oldOption = prevState.currentOption;
          const newOption =
            key === 38
              ? oldOption === 0
                ? prevState.filteredOptions.length - 1
                : oldOption - 1
              : oldOption === prevState.filteredOptions.length - 1
              ? 0
              : oldOption + 1;
          if (prevState.showOptions) {
            prevState.filteredOptions[newOption].ref.current.scrollIntoView({
              block: "center",
            });
          }
          return { currentOption: newOption };
        });
      }
    }
  };

  render() {
    let options = <></>;
    if (this.state.showOptions) {
      if (this.state.filteredOptions.length <= 0) {
        options = <div>No modules found</div>;
      } else {
        options = (
          <ul
            className="list-group"
            style={{ maxHeight: "30vh", overflow: "auto" }}
          >
            {this.state.filteredOptions.map((option, index) => {
              let style = "list-group-item";
              if (index === this.state.currentOption) {
                style = "list-group-item list-group-item-info";
              }
              return (
                <li
                  key={option.code}
                  id={index}
                  onClick={this.onClickOption}
                  onKeyDown={this.onKeyDown}
                  className={style}
                  ref={option.ref}
                >
                  {option.name}
                </li>
              );
            })}
          </ul>
        );
      }
    }

    return (
      <>
        <input
          id={this.props.id}
          className="form-control"
          value={this.state.displayedInput}
          onClick={this.onClickInput}
          onChange={this.onChangeInput}
          onKeyDown={this.onKeyDown}
          autoComplete="off"
          placeholder="Choose a module"
        />
        {options}
      </>
    );
  }
}
