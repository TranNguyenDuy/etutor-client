import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { ConfirmModal } from "../../../modals/confirm-modal";
import { addAlert } from "../../../redux/actions";
import { UserService } from "../../../services/user";
import { SortableHeader } from "./sortable-header/SortableHeader";

function UserRow(props) {
  const user = props.user;
  const userLink = `/${user.role}s/${user.id}`;
  const onSelect = () => {
    props.onSelect(userLink);
  };

  return (
    <tr onDoubleClick={onSelect} key={user.id.toString()}>
      <td>{user.firstName}</td>
      <td>{user.lastName}</td>
      <td>{user.email}</td>
      <td>
        <Button size="sm" color="primary" className="mr-2" onClick={onSelect}>
          View
        </Button>
        {props.allowDelete && (
          <Button size="sm" color="danger" onClick={props.onDelete}>
            Delete
          </Button>
        )}
      </td>
    </tr>
  );
}

class Users extends Component {
  state = {
    isLoading: false,
    users: [],
    metadata: {
      key: "",
      page: 0,
      pageSize: 10,
      total: 0,
      totalPage: 1,
      sortKey: "",
      sortDirection: "",
    },
    deleteModalOpen: false,
    deleteId: "",
    isDeleting: false,
  };

  componentDidMount = () => {
    this.loadData();
  };

  loadData = () => {
    this.setState({
      isLoading: true,
    });
    UserService.getUserList(
      this.props.location.state && this.props.location.state.role
        ? this.props.location.state.role
        : "student",
      this.state.metadata
    )
      .then((res) => {
        this.setState({
          users: res.data.data,
          metadata: {
            ...res.data.metadata,
            totalPage: Math.ceil(
              (res.data.metadata.total || 0) /
                (res.data.metadata.pageSize || 20)
            ),
          },
        });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (this)
          this.setState({
            isLoading: false,
          });
      });
  };

  moveToPage = (page) => {
    return () => {
      if (page < 0 || page >= this.state.metadata.totalPage) return;
      this.setState(
        {
          metadata: {
            ...this.state.metadata,
            page: page,
          },
        },
        this.loadData
      );
    };
  };

  renderPaginationItems = () => {
    let paginationItems = [];
    for (let i = 0; i < this.state.metadata.totalPage; i++) {
      paginationItems.push(
        <PaginationItem
          key={i}
          active={this.state.metadata.page === i}
          onClick={this.moveToPage(i)}
        >
          <PaginationLink tag="button">{i + 1}</PaginationLink>
        </PaginationItem>
      );
    }
    return paginationItems;
  };

  hasRoles = (roles) => {
    const { user } = this.props.auth;
    if (!user || !user.role) return false;
    const roleMatched = roles.includes(user.role);
    return roleMatched;
  };

  allowedToAdd = () => {
    const {
      location: { state },
    } = this.props;
    if (!state) return false;
    switch (state.role) {
      case "staff":
        if (this.hasRoles(["admin"])) return true;
        return false;
      case "student":
        if (this.hasRoles(["admin", "staff"])) return true;
        return false;
      case "tutor":
        if (this.hasRoles(["admin", "staff"])) return true;
        return false;
      default:
        return false;
    }
  };

  allowedToDelete = () => {
    const {
      location: { state },
    } = this.props;
    if (!state) return false;
    switch (state.role) {
      case "staff":
        if (this.hasRoles(["admin"])) return true;
        return false;
      case "student":
        if (this.hasRoles(["admin", "staff"])) return true;
        return false;
      case "tutor":
        if (this.hasRoles(["admin", "staff"])) return true;
        return false;
      default:
        return false;
    }
  };

  onDelete = (id) => () => {
    this.setState({
      deleteModalOpen: true,
      deleteId: id,
    });
  };

  delete = () => {
    const { deleteId } = this.state;
    if (!deleteId)
      return this.setState({
        deleteModalOpen: false,
      });
    const { state } = this.props.location;
    if (!state || !state.role)
      return this.setState({
        deleteModalOpen: false,
        deleteId: "",
      });

    this.setState({
      isDeleting: true,
    });
    UserService.deleteUser(deleteId, state.role)
      .then(() => {
        this.loadData();
      })
      .finally(() => {
        this.setState({
          deleteModalOpen: false,
          deleteId: "",
          isDeleting: false,
        });
      });
  };

  onSearch = (key) => {
    this.setState(
      {
        metadata: {
          ...this.state.metadata,
          key,
        },
      },
      this.loadData
    );
  };

  sort = (key, direction) => {
    this.setState(
      {
        metadata: {
          ...this.state.metadata,
          sortKey: key,
          sortDirection: direction,
        },
      },
      this.loadData
    );
  };

  render() {
    const {
      location: { state },
    } = this.props;

    return (
      <div className="animated fadeIn">
        <ConfirmModal
          {...{
            isOpen: this.state.deleteModalOpen,
            type: "danger",
            onConfirm: this.delete,
            toggle: () =>
              this.setState({ deleteModalOpen: !this.state.deleteModalOpen }),
            onCancel: () =>
              this.setState({
                deleteModalOpen: false,
              }),
            title: "Confirm delete",
            content: "Are you sure to delete this user?",
            disableButtons: this.state.isDeleting,
          }}
        />
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>{" "}
                {state && state.role ? state.role : "User"} List
                <div className="card-header-actions">
                  {this.allowedToAdd() && (
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => {
                        console.log(`${this.props.location.pathname}/add`);
                        this.props.history.push(
                          `${this.props.location.pathname}/add`
                        );
                      }}
                    >
                      <i className="fa fa-plus"></i>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col cols={12} md={3} className="d-flex">
                    <span className="my-auto">Showing&nbsp;</span>
                    <Input
                      style={{
                        width: "fit-content",
                      }}
                      type="select"
                      value={this.state.metadata.pageSize}
                      onChange={(e) => {
                        this.setState(
                          {
                            metadata: {
                              ...this.state.metadata,
                              pageSize: parseInt(e.target.value),
                            },
                          },
                          this.loadData
                        );
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </Input>
                    <span className="my-auto">&nbsp;rows per page</span>
                  </Col>
                  <Col cols={12} md={6}></Col>
                  <Col cols={12} md={3}>
                    <InputGroup>
                      <Input
                        value={this.state.metadata.key}
                        onChange={(e) => this.onSearch(e.target.value)}
                        placeholder="Type something to search..."
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="fa fa-search"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                </Row>
                <Table responsive hover borderless>
                  <thead>
                    <tr>
                      <th scope="col">
                        <SortableHeader
                          name="First name"
                          sortKey="firstName"
                          sort={{
                            sortKey: this.state.metadata.sortKey,
                            sortDirection: this.state.metadata.sortDirection,
                          }}
                          onSort={this.sort}
                        />
                      </th>
                      <th scope="col">
                        <SortableHeader
                          name="Last name"
                          sortKey="lastName"
                          sort={{
                            sortKey: this.state.metadata.sortKey,
                            sortDirection: this.state.metadata.sortDirection,
                          }}
                          onSort={this.sort}
                        />
                      </th>
                      <th scope="col">
                        <SortableHeader
                          name="Email"
                          sortKey="email"
                          sort={{
                            sortKey: this.state.metadata.sortKey,
                            sortDirection: this.state.metadata.sortDirection,
                          }}
                          onSort={this.sort}
                        />
                      </th>
                      <th scope="col">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.isLoading ? (
                      <tr>
                        <td className="text-center" colSpan={4}>
                          <Spinner color="primary" />
                        </td>
                      </tr>
                    ) : this.state.users.length ? (
                      this.state.users.map((user, index) => (
                        <UserRow
                          key={index}
                          user={user}
                          onSelect={(link) => {
                            this.props.history.push(link);
                          }}
                          allowDelete={this.allowedToDelete()}
                          onDelete={this.onDelete(user.id)}
                        />
                      ))
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={4}>
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Pagination>
                  <PaginationItem
                    onClick={this.moveToPage(this.state.metadata.page - 1)}
                  >
                    <PaginationLink previous tag="button"></PaginationLink>
                  </PaginationItem>
                  {this.renderPaginationItems()}
                  <PaginationItem
                    onClick={this.moveToPage(this.state.metadata.page + 1)}
                  >
                    <PaginationLink next tag="button"></PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  addAlert: (options) => dispatch(addAlert(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
