// react-bootstrap
import {
  Dropdown,
  DropdownButton,
  Modal,
  Table,
  Button,
  ButtonGroup,
} from "react-bootstrap";
// Fontawesome
// import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrashCan, FaPen, FaClockRotateLeft } from "react-icons/fa6";
// Local
import CommentForm from "../CommentForm";
import { modal_modules, modal_mode_modules } from "../utils";
import {
  change_comment_api,
  delete_comment_api,
  get_comment_changelog_api,
} from "../api";
import { useUserStore } from "../../../stores/user";
import { useEffect, useState } from "react";

// Components
const DeleteConfirmModal = ({ confirmAndHide, cancelAndHide, iid }) => {
  return (
    <div>
      <p>
        您確定要刪除嗎？<strong className="allcaps">此操作無法撤銷</strong>！
      </p>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={confirmAndHide} variant="danger">
          刪除
        </Button>
        <Button onClick={cancelAndHide} variant="secondary">
          取消
        </Button>
      </ButtonGroup>
    </div>
  );
};

const ChangelogList = ({ cid, closeChangelog }) => {
  const [changelogs, set_changelogs] = useState([]);
  useEffect(() => {
    get_comment_changelog_api(cid).then((response) => {
      set_changelogs(response.result);
    });
  }, [cid]);
  function TableRows({ changelogs }) {
    if (changelogs.length < 1) {
      return (
        <tr>
          <td colSpan={3} className="text-center">
            意見發表後從未修改過
          </td>
        </tr>
      );
    }
    return changelogs.map((its) => (
      <tr key={its.id}>
        <td>
          <time dateTime={its.created_at}>{its.created_at}</time>
        </td>
        <td>{its.before}</td>
        <td>{its.after}</td>
      </tr>
    ));
  }
  return (
    <div className="changelog-list">
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>修改日期</th>
            <th>修改前意見</th>
            <th>修改後意見</th>
          </tr>
        </thead>
        <tbody>
          <TableRows changelogs={changelogs} />
        </tbody>
      </Table>
    </div>
  );
};

const ModalTitle = ({ modalmode }) => {
  switch (modalmode.mode) {
    case modalmode.EDITING:
      return "編輯";
    case modalmode.REMOVING:
      return "刪除";
    case modalmode.CHANGELOG:
      return "修改記錄";
    default:
      return "不明";
  }
};

const RemoveIcon = ({ onClick }) => {
  const dev = false;
  if( dev ) {
    return <FaTrashCan onClick={onClick} />;
  }
  return <img
    className="click-icon"
    width={16}
    height={16}
    src="/UserListSource/delete.png"
    alt="Delete icon"
    onClick={onClick}
  />;
};

// Modules

/**
 * Changelog actions
 * @param {*} modalmode
 * @param {*} show_modal
 * @param {*} close_modal
 * @returns
 */
function changelog_modules(modalmode, show_modal, close_modal) {
  const ChangelogForm = ({ modalmode, cid, closeChangelog }) => {
    const can_log = modalmode.mode === modalmode.CHANGELOG;
    return can_log ? (
      <ChangelogList cid={cid} closeChangelog={closeChangelog} />
    ) : (
      <div></div>
    );
  };
  const open_changelog = () => {
    modalmode.set_mode(modalmode.CHANGELOG);
    show_modal();
  };
  const close_changelog = () => {
    close_modal();
  };
  return { ChangelogForm, open_changelog, close_changelog };
}

/**
 * Editing actions
 * @param {*} modalmode
 * @param {*} show_modal
 * @param {*} close_modal
 * @param {*} cid
 * @param {*} onEdit
 * @returns
 */
function edit_modules(modalmode, show_modal, close_modal, cid, onEdit) {
  const EditForm = ({ modalmode, pid, closeEditing, preloadDatas }) => {
    const can_edit = modalmode.mode === modalmode.EDITING;
    return can_edit ? (
      <CommentForm
        pid={pid}
        submitAction={closeEditing}
        preloadDatas={preloadDatas}
        method="PUT"
      />
    ) : (
      <div></div>
    );
  };
  const open_editing = () => {
    modalmode.set_mode(modalmode.EDITING);
    show_modal();
  };
  const close_editing = (form_dom) => {
    const ajax = change_comment_api(form_dom, cid);
    ajax
      .then((response) => {
        console.log(response);
        onEdit();
        close_modal();
      })
      .catch((response) => {
        console.error(response);
        alert(response.message);
      });
  };
  return { EditForm, open_editing, close_editing };
}

/**
 * Removing actions
 * @param {*} modalmode
 * @param {*} show_modal
 * @param {*} close_modal
 * @param {*} cid
 * @param {*} onDelete
 * @returns
 */
function remove_modules(modalmode, show_modal, close_modal, cid, onDelete) {
  const RemoveForm = ({ modalmode, cancelAndHide, confirmAndHide }) => {
    const can_remove = modalmode.mode === modalmode.REMOVING;
    return can_remove ? (
      <DeleteConfirmModal
        cancelAndHide={cancelAndHide}
        confirmAndHide={confirmAndHide}
      />
    ) : (
      <div></div>
    );
  };
  const open_removing = () => {
    modalmode.set_mode(modalmode.REMOVING);
    show_modal();
  };
  const close_removing = (confirmed = false) => {
    if (!confirmed) {
      close_modal();
      return;
    }
    const ajax = delete_comment_api(cid);
    ajax
      .then((response) => {
        console.log(response);
        onDelete();
        close_modal();
      })
      .catch((response) => {
        console.error(response);
        alert(response.message);
      });
  };
  return { RemoveForm, open_removing, close_removing };
}

/**
 * Used by the 各景點活動的意見 modal
 * @param {*} param
 * @returns
 */
export function ModalOprationPanel({
  pid,
  cid,
  onDelete,
  onEdit,
  preloadDatas,
}) {
  const { user } = useUserStore();
  const { show, close_modal, show_modal } = modal_modules();
  const modalmode = modal_mode_modules();
  // Removing actions
  const { RemoveForm, open_removing, close_removing } = remove_modules(
    modalmode,
    show_modal,
    close_modal,
    cid,
    onDelete
  );
  const { EditForm, open_editing, close_editing } = edit_modules(
    modalmode,
    show_modal,
    close_modal,
    cid,
    onEdit
  );
  const { ChangelogForm, open_changelog, close_changelog } = changelog_modules(
    modalmode,
    show_modal,
    close_modal
  );
  // HTML
  const ModalTitle = ({ modalmode }) => {
    switch (modalmode.mode) {
      case modalmode.EDITING:
        return "編輯";
      case modalmode.REMOVING:
        return "刪除";
      case modalmode.CHANGELOG:
        return "修改記錄";
      default:
        return "不明";
    }
  };
  const is_user = preloadDatas.uid === user.id;
  const delete_option = is_user ?
    <RemoveIcon onClick={open_removing} /> :
    <span></span>
  ;
  const edit_option = is_user ?
    <FaPen
      className="click-icon"
      onClick={open_editing}
      style={{ color: '#999999' }}
    /> :
    <span></span>
  ;
  const changelog_option = <FaClockRotateLeft
    className="click-icon"
    onClick={open_changelog}
    style={{ color: '#999999' }}
  />;
  return (
    <div className="item-panel" data-uid={user.id}>
      {delete_option}
      {edit_option}
      {changelog_option}
      <div className="modals">
        <Modal
          id="edit-form-modal"
          size="xs"
          centered
          show={show}
          onHide={close_modal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <ModalTitle modalmode={modalmode} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RemoveForm
              modalmode={modalmode}
              confirmAndHide={() => close_removing(true)}
              cancelAndHide={() => close_removing(false)}
            />
            <EditForm
              modalmode={modalmode}
              pid={pid}
              preloadDatas={preloadDatas}
              closeEditing={close_editing}
            />
            <ChangelogForm
              modalmode={modalmode}
              cid={cid}
              closeChangelog={close_changelog}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

/**
 * Used by the 用戶發表的意見 list
 * @param {*} param
 * @returns
 */
export function UserOprationPanel({
  pid,
  cid,
  onDelete,
  onEdit,
  preloadDatas,
}) {
  const { show, close_modal, show_modal } = modal_modules();
  const modalmode = modal_mode_modules();
  const { RemoveForm, open_removing, close_removing } = remove_modules(
    modalmode,
    show_modal,
    close_modal,
    cid,
    onDelete
  );
  const { EditForm, open_editing, close_editing } = edit_modules(
    modalmode,
    show_modal,
    close_modal,
    cid,
    onEdit
  );
  const { ChangelogForm, open_changelog, close_changelog } = changelog_modules(
    modalmode,
    show_modal,
    close_modal
  );
  return (
    <div className="opration-panel">
      <DropdownButton title="" variant="flat">
        <Dropdown.Item onClick={open_editing} style={{ padding: "10px 15px" }}>
          <FaPen style={{ color: '#999999' }} />
          <span style={{ marginLeft: "8px" }}>編輯</span>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={open_changelog}
          style={{ padding: "10px 15px" }}
        >
          <FaClockRotateLeft style={{ color: '#999999' }} />
          <span style={{ marginLeft: "8px" }}>編輯記錄</span>
        </Dropdown.Item>

        <Dropdown.Item onClick={open_removing} style={{ padding: "10px 15px" }}>
          <RemoveIcon />
          <span style={{ marginLeft: "8px" }}>刪除</span>
        </Dropdown.Item>
      </DropdownButton>
      <div className="modals">
        <Modal
          id="edit-form-modal"
          size="xs"
          centered
          show={show}
          onHide={close_modal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <ModalTitle modalmode={modalmode} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RemoveForm
              modalmode={modalmode}
              confirmAndHide={() => close_removing(true)}
              cancelAndHide={() => close_removing(false)}
            />
            <EditForm
              modalmode={modalmode}
              pid={pid}
              preloadDatas={preloadDatas}
              closeEditing={close_editing}
            />
            <ChangelogForm
              modalmode={modalmode}
              cid={cid}
              closeChangelog={close_changelog}
            />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
