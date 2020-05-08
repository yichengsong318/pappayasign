import classnames from 'classnames'
// core components
import HeaderDefault from 'components/Headers/HeaderDefault.js'
import $ from 'jquery'
import React from 'react'
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Row,
  TabContent,
  Table,
  TabPane,
} from 'reactstrap'
import DataVar from '../../variables/data'
import TemplateDataVar from '../../variables/templatedata'

const axios = require('axios').default

class Tables extends React.Component {
  state = {
    tabs: 1,
  }
  toggleNavs = (e, state, index) => {
    e.preventDefault()
    this.setState({
      [state]: index,
    })
  }

  componentDidMount() {
    try {
      var mainurl = document.location.hash,
        params = mainurl.split('?')[1].split('&'),
        data = {},
        tmp
      for (var i = 0, l = params.length; i < l; i++) {
        tmp = params[i].split('=')
        data[tmp[0]] = tmp[1]
      }
      var action = data.action

      if (action === 'inbox') {
        var inboxbtn = document.getElementById('inboxbtn')
        inboxbtn.click()
      } else if (action === 'sent') {
        var sentbtn = document.getElementById('sentbtn')
        sentbtn.click()
      } else if (action === 'requests') {
        var actionrequiredbtn = document.getElementById('actionrequiredbtn')
        actionrequiredbtn.click()
      } else if (action === 'completed') {
        var completedbtn = document.getElementById('completedbtn')
        completedbtn.click()
      }
    } catch (error) {}

    var modal = document.querySelectorAll('.modal')
    modal[0].style.display = 'block'
    var userid = ''
    var email = ''
    var voiduserid = ''
    var voidfileid = ''
    var voidstatus = ''
    var deleteuserid = ''
    var deletefileid = ''
    var deletestatus = ''
    var unifileid = ''
    var uniid = ''
    var droptoggle = 0

    function getCookie(name) {
      var nameEQ = name + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    }

    var userid = getCookie('uid')

    if (userid) {
      //console.log('user logged in');
      //console.log(userid);
      var email = getCookie('useremail')

      inboxfunc()
      datafunc()
      //modal[5].style.display = 'block'
    } else {
      window.location.hash = '#/auth/login'
    }

    function inboxfunc() {
      modal[0].style.display = 'block'
      $('#actionrequiredtable tbody tr').remove()
      $('#alltable tbody tr').remove()
      $('#deletedtable tbody tr').remove()
      $('#completedtable tbody tr').remove()

      axios
        .post('/getuserdata', {
          UserID: userid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'user found') {
            var Request = response.data.user.Request
            var allcontent = ''
            var deletedcontent = ''
            var completedcontent = ''
            var actionrequiredcontent = ''

            Request.forEach(function (data, index) {
              if (
                Request[index].RecepientStatus == 'Void' ||
                Request[index].RecepientStatus == 'Need to Sign' ||
                Request[index].RecepientStatus == 'Correcting'
              ) {
                allcontent += '<tr >'
                allcontent += '<th><input  type="checkbox"></th>'
                allcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                allcontent +=
                  '<td id="datastatus">' +
                  Request[index].RecepientStatus +
                  '</td>'
                allcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                allcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                allcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                allcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                allcontent +=
                  `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=` +
                  Request[index].DocumentID +
                  `&type=db&u=` +
                  Request[index].From +
                  `">SIGN</a></button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                allcontent += '</tr>'
                if (Request[index].RecepientStatus == 'Need to Sign') {
                  actionrequiredcontent += '<tr >'
                  actionrequiredcontent += '<th><input  type="checkbox"></th>'
                  actionrequiredcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    Request[index].DocumentName +
                    '\nFrom: ' +
                    data.FromEmail +
                    '</span></td>'
                  actionrequiredcontent +=
                    '<td id="datastatus">' +
                    Request[index].RecepientStatus +
                    '</td>'
                  actionrequiredcontent +=
                    '<td id="datakey" hidden>' +
                    Request[index].DocumentID +
                    '</td>'
                  actionrequiredcontent +=
                    '<td id="datauid" hidden>' + Request[index].From + '</td>'
                  actionrequiredcontent +=
                    '<td id="datarecep" hidden>' +
                    Request[index].FromEmail +
                    '</td>'
                  actionrequiredcontent +=
                    '<td >' + Request[index].RecepientDateStatus + '</td>'
                  actionrequiredcontent +=
                    `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary"><a href="#/admin/sign?id=` +
                    Request[index].DocumentID +
                    `&type=db&u=` +
                    Request[index].From +
                    `">SIGN</a></button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item move" type="button">Move</button>
                <button class="dropdown-item correct" type="button">Correct</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item void" type="button">Void</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
              </div></td >`
                  actionrequiredcontent += '</tr>'
                }
              } else if (Request[index].RecepientStatus == 'Deleted') {
                deletedcontent += '<tr >'
                deletedcontent += '<th><input  type="checkbox"></th>'
                deletedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                deletedcontent +=
                  '<td id=datastatus>' +
                  Request[index].RecepientStatus +
                  '</td>'
                deletedcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                deletedcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                deletedcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                deletedcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                deletedcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary restore">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item correct" type="button">Continue</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              </div>
              </div></td >`
                deletedcontent += '</tr>'
              } else if (Request[index].RecepientStatus == 'Completed') {
                completedcontent += '<tr >'
                completedcontent += '<th><input  type="checkbox"></th>'
                completedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  Request[index].DocumentName +
                  '\nFrom: ' +
                  Request[index].FromEmail +
                  '</span></td>'
                completedcontent +=
                  '<td id="datastatus">' +
                  Request[index].RecepientStatus +
                  '</td>'
                completedcontent +=
                  '<td id="datakey" hidden>' +
                  Request[index].DocumentID +
                  '</td>'
                completedcontent +=
                  '<td id="datauid" hidden>' + Request[index].From + '</td>'
                completedcontent +=
                  '<td id="datarecep" hidden>' +
                  Request[index].FromEmail +
                  '</td>'
                completedcontent +=
                  '<td >' + Request[index].RecepientDateStatus + '</td>'
                completedcontent += `<td ><div class="btn-group">
            <button type="button" class="btn btn-primary move">MOVE</button>
            <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
            <div class="dropdown-menu2" id="dropdown">
            <button class="dropdown-item correct" type="button">Forward</button>
            <button class="dropdown-item create" type="button">Create a Copy</button>
            <button class="dropdown-item savetemplate" type="button">Save as Template</button>
            <button class="dropdown-item history" type="button">History</button>
            <button class="dropdown-item export" type="button">Export as CSV</button>
            <button class="dropdown-item deletemanage" type="button">Delete</button>
            </div>
          </div></td >`
                completedcontent += '</tr>'
              }
            })
            $('#alltable').append(allcontent)
            $('#deletedtable').append(deletedcontent)
            $('#actionrequiredtable').append(actionrequiredcontent)
            $('#completedtable').append(completedcontent)
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[0].style.display = 'none'
        })
    }

    function datafunc() {
      modal[0].style.display = 'block'
      $('#senttable tbody tr').remove()
      $('#waitingtable tbody tr').remove()
      $('#expiringtable tbody tr').remove()
      $('#authtable tbody tr').remove()

      axios
        .post('/getmanagedocdata', {
          UserID: userid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc found') {
            var Documents = response.data.doc
            //console.log(Documents);
            var sentcontent = ''
            var draftcontent = ''
            var deletedcontent = ''
            var completedcontent = ''
            var waitingcontent = ''
            var authcontent = ''
            var expiringcontent = ''

            Documents.forEach(function (data, index) {
              var reciverlist = ''
              try {
                data.Reciever.forEach(function (reciever, index) {
                  var id = index + 1
                  reciverlist =
                    reciverlist + ' ' + reciever.RecepientEmail + '\n'
                })
              } catch (error) {}

              if (
                data.Status == 'Sent' ||
                data.Status == 'Waiting for Others' ||
                data.Status == 'Declined' ||
                data.Status == 'Void' ||
                data.Status == 'Authentication Failed' ||
                data.Status == 'Correcting' ||
                data.Status == 'Completed' ||
                data.Status == 'Expiring' ||
                data.Status == 'Draft'
              ) {
                if (data.Status == 'Waiting for Others') {
                  waitingcontent += '<tr >'
                  waitingcontent += '<th><input  type="checkbox"></th>'
                  waitingcontent +=
                    '<td scope="row" class="rowselect" ><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  waitingcontent += '<td id=datastatus>' + data.Status + '</td>'
                  waitingcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  waitingcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  waitingcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  waitingcontent += '<td >' + data.DateStatus + '</td>'
                  waitingcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  waitingcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Correcting') {
                  sentcontent += '<tr >'
                  sentcontent += '<th><input  type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Void') {
                  sentcontent += '<tr >'
                  sentcontent += '<th><input  type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary move">MOVE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Draft') {
                  draftcontent += '<tr >'
                  draftcontent += '<th><input  type="checkbox"></th>'
                  draftcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  draftcontent += '<td id=datastatus>' + data.Status + '</td>'
                  draftcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  draftcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  draftcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  draftcontent += '<td >' + data.DateStatus + '</td>'
                  draftcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary correct">CONTINUE</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  draftcontent += '</tr>'
                } else if (data.Status == 'Authentication Failed') {
                  authcontent += '<tr >'
                  authcontent += '<th><input  type="checkbox"></th>'
                  authcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  authcontent += '<td id=datastatus>' + data.Status + '</td>'
                  authcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  authcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  authcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  authcontent += '<td >' + data.DateStatus + '</td>'
                  authcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
                  authcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Expiring') {
                  expiringcontent += '<tr >'
                  expiringcontent += '<th><input  type="checkbox"></th>'
                  expiringcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  expiringcontent +=
                    '<td id=datastatus>' + data.Status + '</td>'
                  expiringcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  expiringcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  expiringcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  expiringcontent += '<td >' + data.DateStatus + '</td>'
                  expiringcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
              </div></td >`
                  expiringcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary resend">RESEND</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                } else if (data.Status == 'Completed') {
                  completedcontent += '<tr >'
                  completedcontent += '<th><input  type="checkbox"></th>'
                  completedcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  completedcontent +=
                    '<td id=datastatus>' + data.Status + '</td>'
                  completedcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  completedcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  completedcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  completedcontent += '<td >' + data.DateStatus + '</td>'
                  completedcontent += `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary move">MOVE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Forward</button>
                <button class="dropdown-item create" type="button">Create a Copy</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                <button class="dropdown-item history" type="button">History</button>
                <button class="dropdown-item export" type="button">Export as CSV</button>
                <button class="dropdown-item deletemanage" type="button">Delete</button>
                </div>
                </div></td >`
                  completedcontent += '</tr>'

                  sentcontent += '<tr >'
                  sentcontent +=
                    '<th><input class="primary" type="checkbox"></th>'
                  sentcontent +=
                    '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                    data.DocumentName +
                    '\nTo: ' +
                    reciverlist +
                    '</span></td>'
                  sentcontent += '<td id=datastatus>' + data.Status + '</td>'
                  sentcontent +=
                    '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                  sentcontent +=
                    '<td id="datarecep" hidden>' + reciverlist + '</td>'
                  sentcontent +=
                    '<td id="datauid" hidden>' + data.Owner + '</td>'
                  sentcontent += '<td >' + data.DateStatus + '</td>'
                  sentcontent += `<td ><div class="btn-group">
              <button type="button" class="btn btn-primary move">Move</button>
              <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
              <div class="dropdown-menu2" id="dropdown">
              <button class="dropdown-item move" type="button">Move</button>
              <button class="dropdown-item correct" type="button">Correct</button>
              <button class="dropdown-item create" type="button">Create a Copy</button>
              <button class="dropdown-item savetemplate" type="button">Save as Template</button>
              <button class="dropdown-item void" type="button">Void</button>
              <button class="dropdown-item history" type="button">History</button>
              <button class="dropdown-item export" type="button">Export as CSV</button>
              <button class="dropdown-item deletemanage" type="button">Delete</button>
              </div>
            </div></td >`
                  sentcontent += '</tr>'
                }
              } else if (data.Status == 'Deleted') {
                deletedcontent += '<tr >'
                deletedcontent += '<th><input  type="checkbox"></th>'
                deletedcontent +=
                  '<td scope="row" class="rowselect"><span className="mb-0 text-sm">' +
                  data.DocumentName +
                  '\nTo: ' +
                  reciverlist +
                  '</span></td>'
                deletedcontent += '<td id=datastatus>' + data.Status + '</td>'
                deletedcontent +=
                  '<td id="datakey" hidden>' + data.DocumentID + '</td>'
                deletedcontent +=
                  '<td id="datarecep" hidden>' + reciverlist + '</td>'
                deletedcontent +=
                  '<td id="datauid" hidden>' + data.Owner + '</td>'
                deletedcontent += '<td >' + data.DateStatus + '</td>'
                deletedcontent += `<td ><div class="btn-group">
                <button type="button" class="btn btn-primary restore">CONTINUE</button>
                <button type="button" class="btn btn-primary action dropdown-toggle dropdown-toggle-split"></button>
                <div class="dropdown-menu2" id="dropdown">
                <button class="dropdown-item correct" type="button">Continue</button>
                <button class="dropdown-item savetemplate" type="button">Save as Template</button>
                </div>
                </div></td >`
                deletedcontent += '</tr>'
              }
            })
            $('#senttable').append(sentcontent)
            $('#draftstable').append(draftcontent)
            $('#deletedtable').append(deletedcontent)
            $('#completedtable').append(completedcontent)
            $('#waitingtable').append(waitingcontent)
            $('#expiringtable').append(expiringcontent)
            $('#authtable').append(authcontent)
            modal[0].style.display = 'none'
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[0].style.display = 'none'
        })
    }

    $(document).on('click', '.rowselect', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      $('#managerecepientstable li').remove()
      $('#managerecepientstable').innerHTML = ''
      document.getElementById('managebody').style.display = 'none'
      document.getElementById('detailbody').style.display = 'block'
      //console.log($(this).parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().children('#datastatus')[0].innerHTML);
      var rowselectuserid = $(this).parent().children('#datauid')[0].innerHTML
      var rowselectfileid = $(this).parent().children('#datakey')[0].innerHTML
      var rowselectstatus = $(this).parent().children('#datastatus')[0]
        .innerHTML
      unifileid = rowselectfileid
      uniid = rowselectuserid

      axios
        .post('/getdocdata', {
          DocumentID: rowselectfileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            //console.log(Document.Reciever);

            var reciverlistrow = ''
            try {
              Document.Reciever.forEach(function (reciever, index) {
                var id = index + 1
                reciverlistrow =
                  reciverlistrow + ' ' + reciever.RecepientEmail + ','

                var li = document.createElement('li')
                li.innerHTML =
                  `<div class="rcardmanage">
                <div class="managelabelspan">
                <strong><span  id="summary-recepient-name">Name: ` +
                  reciever.RecepientName +
                  `</span></strong>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">` +
                  reciever.RecepientEmail +
                  `</span>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">Action: ` +
                  reciever.RecepientOption +
                  `</span>
                </div>
                <div class="managelabelspan">
                <span  id="summary-recepient-name">Status: ` +
                  reciever.RecepientStatus +
                  `</span>
                </div>
                </div>`
                $('#managerecepientstable').append(li)
              })
              document.getElementById('detailsubject').innerHTML =
                Document.DocumentName
              document.getElementById('detailid').innerHTML = rowselectfileid
              document.getElementById('detailsent').innerHTML =
                Document.DateSent
              document.getElementById('detailcreate').innerHTML =
                Document.DateCreated
              document.getElementById('detailholder').innerHTML =
                Document.OwnerEmail
              document.getElementById(
                'detailrecepients'
              ).innerHTML = reciverlistrow
              document.getElementById('detailstatus').innerHTML =
                Document.Status
              document.getElementById('detailstatusdate').innerHTML =
                Document.DateStatus
              modal[2].style.display = 'none'
            } catch (error) {
              modal[2].style.display = 'none'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $('#detailbackbtn').click(function () {
      document.getElementById('managebody').style.display = 'block'
      document.getElementById('detailbody').style.display = 'none'
      $('#managerecepientstable li').remove()
      $('#managerecepientstable').innerHTML = ''
      document.getElementById('detailsubject').innerHTML = ''
      document.getElementById('detailid').innerHTML = ''
      document.getElementById('detailsent').innerHTML = ''
      document.getElementById('detailcreate').innerHTML = ''
      document.getElementById('detailholder').innerHTML = ''
      document.getElementById('detailrecepients').innerHTML = ''
      document.getElementById('detailstatus').innerHTML = ''
      document.getElementById('detailstatusdate').innerHTML = ''
    })

    $('#detaildownloadbtn').click(function () {
      modal[2].style.display = 'block'
      //console.log(uniid);
      //console.log(unifileid);
      var blobUrl = URL.createObjectURL('blob')
      var link = document.createElement('a')
      link.href = blobUrl
      link.style = 'display: none'
      link.download = '' + unifileid + '.pdf'
      link.click()
      modal[2].style.display = 'none'
    })

    $('#detailprintbtn').click(function () {
      modal[2].style.display = 'block'
      //console.log(uniid);
      //console.log(unifileid);
      var iframe = document.createElement('iframe')
      // iframe.id = 'pdfIframe'
      iframe.className = 'pdfIframe'
      document.body.appendChild(iframe)
      iframe.style.display = 'none'
      iframe.onload = function () {
        setTimeout(function () {
          iframe.focus()
          iframe.contentWindow.print()
          URL.revokeObjectURL('url')
          // document.body.removeChild(iframe)
        }, 1)
      }
      iframe.src = 'url'
      modal[2].style.display = 'none'
    })

    $(document).on('click', '.void', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        voiduserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        voidfileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        voidstatus = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        voiduserid = $(this).parent().parent().parent().children('#datauid')[0]
          .innerHTML
        voidfileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        voidstatus = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      modal[3].style.display = 'block'
    })

    $('#managevoidapprovebtn').click(function () {
      modal[3].style.display = 'none'
      modal[2].style.display = 'block'
      var today = new Date().toLocaleString().replace(',', '')
      var managevoidmessage = document.getElementById('managevoidmessage').value
      if (managevoidmessage !== '') {
        axios
          .post('/getReciever', {
            DocumentID: voidfileid,
          })
          .then(function (response) {
            console.log(response)
            if (response.data.Status === 'got recievers') {
              var recievers = response.data.Reciever
              var status = response.data.DocStatus

              recievers.forEach(function (item, index) {
                var recepient_index = index
                //console.log(recepient_index);

                recievers[index].RecepientStatus = 'Void'
                recievers[index].RecepientDateStatus = today

                axios
                  .post('/updaterecieverdata', {
                    Reciever: recievers,
                  })
                  .then(function (response) {
                    console.log(response)
                  })
                  .catch(function (error) {
                    console.log(error)
                    modal[2].style.display = 'none'
                  })

                axios
                  .post('/getRequests', {
                    UserID: voiduserid,
                  })
                  .then(function (response) {
                    console.log(response)
                    if (response.data.Status === 'got request') {
                      var request = response.data.Request
                      var status = response.data.DocStatus

                      request.forEach(function (item, index) {
                        if (request[index].DocumentID === voidfileid) {
                          var recepient_index = index
                          //console.log(recepient_index);
                          request[index].RecepientStatus = 'Void'
                          request[index].RecepientDateStatus = today

                          axios
                            .post('/updaterequestdata', {
                              UserID: userid,
                              Request: request,
                            })
                            .then(function (response) {
                              console.log(response)
                            })
                            .catch(function (error) {
                              console.log(error)
                              modal[2].style.display = 'none'
                            })
                        }
                      })
                    }
                  })
                  .catch(function (error) {
                    console.log(error)
                    modal[2].style.display = 'none'
                  })

                axios
                  .post('/sendmail', {
                    to: item.RecepientEmail,
                    body:
                      '<div><p>Hello ' +
                      item.RecepientName +
                      ', ' +
                      item.DocumentName +
                      ' Has been voided. \n\nReason:' +
                      managevoidmessage +
                      '</p></div>',
                    subject: 'PappayaSign: Document Voided',
                  })
                  .then(function (response) {
                    console.log(response)
                  })
                  .catch(function (error) {
                    //console.log('no data');
                    modal[2].style.display = 'none'
                  })
              })

              axios
                .post('/updatedocumentstatus', {
                  DocumentID: voidfileid,
                  Status: 'Void',
                })
                .then(function (response) {
                  console.log(response)
                  if (
                    response.data === 'insert done' ||
                    response.data === 'update done'
                  ) {
                    alert('Document Voided')
                    inboxfunc()
                    datafunc()
                    modal[2].style.display = 'none'
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            }
          })
          .catch(function (error) {
            console.log(error)
            modal[2].style.display = 'none'
          })
      } else {
        alert('Please provide a reason, So we could let your recepients know.')
      }
    })

    $('#managevoidcancelbtn').click(function () {
      modal[3].style.display = 'none'
    })

    $(document).on('click', '.deletemanage', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        deleteuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        deletefileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        deletestatus = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        deleteuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        deletefileid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        deletestatus = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      modal[4].style.display = 'block'
    })

    $('#managedeleteapprovebtn').click(function () {
      modal[4].style.display = 'none'
      modal[2].style.display = 'block'
      var today = new Date().toLocaleString().replace(',', '')

      axios
        .post('/getReciever', {
          DocumentID: deletefileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'got recievers') {
            var recievers = response.data.Reciever
            var status = response.data.DocStatus

            recievers.forEach(function (item, index) {
              var recepient_index = index
              //console.log(recepient_index);

              recievers[index].RecepientStatus = 'Deleted'
              recievers[index].RecepientDateStatus = today

              axios
                .post('/updaterecieverdata', {
                  Reciever: recievers,
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })

              axios
                .post('/getRequests', {
                  UserID: deleteuserid,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'got request') {
                    var request = response.data.Request
                    var status = response.data.DocStatus

                    request.forEach(function (item, index) {
                      if (request[index].DocumentID === deletefileid) {
                        var recepient_index = index
                        //console.log(recepient_index);
                        request[index].RecepientStatus = 'Deleted'
                        request[index].RecepientDateStatus = today

                        axios
                          .post('/updaterequestdata', {
                            UserID: userid,
                            Request: request,
                          })
                          .then(function (response) {
                            console.log(response)
                          })
                          .catch(function (error) {
                            console.log(error)
                            modal[2].style.display = 'none'
                          })
                      }
                    })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            })

            axios
              .post('/updatedocumentstatus', {
                DocumentID: deletefileid,
                Status: 'Deleted',
              })
              .then(function (response) {
                console.log(response)
                if (
                  response.data === 'insert done' ||
                  response.data === 'update done'
                ) {
                  alert('Document Deleted')
                  inboxfunc()
                  datafunc()
                  modal[2].style.display = 'none'
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
        })
    })

    $('#managedeletecancelbtn').click(function () {
      modal[4].style.display = 'none'
      modal[2].style.display = 'none'
    })

    $(document).on('click', '.export', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
      var exportuserid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datauid')[0].innerHTML
      var fileid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datakey')[0].innerHTML
      var status = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datastatus')[0].innerHTML
      var recepients = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datarecep')[0].innerHTML

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document

            var datarray = []
            datarray.push({
              DateCreated: Document.DateCreated,
              DateSent: Document.DateSent,
              DateCreated: Document.DateCreated,
              DateStatus: Document.DateStatus,
              DocumentName: Document.DocumentName,
              Owmer: Document.Owner,
              OwnerEmail: Document.OwnerEmail,
              Recepients: recepients,
              Status: Document.Status,
            })
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            CSV(datarray, fileid);
            modal[2].style.display = 'none'
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })


    $(document).on('click', '.history', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
      //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
      var exportuserid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datauid')[0].innerHTML
      var fileid = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datakey')[0].innerHTML
      var status = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datastatus')[0].innerHTML
      var recepients = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .children('#datarecep')[0].innerHTML

      axios
        .post('/gethistory', {
          DocumentID: fileid,
        })
        .then(function (response) {
          var historycontent = '';
          $('#historytable tbody tr').remove()
          modal[2].style.display = 'none'
          modal[5].style.display = 'block'

          console.log(response)
          if (response.data.Status === 'history found') {
            var History = response.data.history

            History.forEach(function (item, index) {
              historycontent += '<tr >'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryTime+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryUser+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryAction+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryActivity+'</th>'
              historycontent += '<th scope="row"><span className="mb-0 text-sm"></span>'+item.HistoryStatus+'</th>'
            historycontent += '</tr>'
            });
            $('#historytable').append(historycontent);

            
            //console.log(datarray);

            //console.log(CSV(datarray, fileid));
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    function CSV(array, csvfileid) {
      // Use first element to choose the keys and the order
      var keys = Object.keys(array[0])

      // Build header
      var result = keys.join(',') + '\n'

      // Add the rows
      array.forEach(function (obj) {
        result += keys.map((k) => obj[k]).join(',') + '\n'
      })

      var hiddenElement = document.createElement('a')
      hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result)
      hiddenElement.target = '_blank'
      hiddenElement.download = '' + csvfileid + '.csv'
      hiddenElement.click()

      return result
    }

    $(document).on('click', '.action', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      if (droptoggle === 0) {
        $(this).parent().children('#dropdown')[0].style.display = 'block'
        droptoggle = 1
      } else if (droptoggle === 1) {
        droptoggle = 0
        $(this).parent().children('#dropdown')[0].style.display = 'none'
      }
    })

    $(document).on('click', '.correct', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var correctuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var correctuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      var today = new Date().toLocaleString().replace(',', '')
      var dbpeople = []

      axios
        .post('/getReciever', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'got recievers') {
            var recievers = response.data.Reciever
            var status = response.data.DocStatus

            recievers.forEach(function (item, index) {
              docname = item.DocumentName
              dbpeople.push({
                name: item.RecepientName,
                email: item.RecepientEmail,
                option: item.RecepientOption,
              })
              //console.log(dbpeople);
              var recepient_index = index
              //console.log(recepient_index);

              recievers[index].RecepientStatus = 'Correcting'
              recievers[index].RecepientDateStatus = today

              axios
                .post('/updaterecieverdata', {
                  Reciever: recievers,
                })
                .then(function (response) {
                  console.log(response)
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })

              axios
                .post('/getRequests', {
                  UserID: correctuserid,
                })
                .then(function (response) {
                  console.log(response)
                  if (response.data.Status === 'got request') {
                    var request = response.data.Request
                    var status = response.data.DocStatus

                    request.forEach(function (item, index) {
                      if (request[index].DocumentID === fileid) {
                        var recepient_index = index
                        //console.log(recepient_index);
                        request[index].RecepientStatus = 'Correcting'
                        request[index].RecepientDateStatus = today

                        axios
                          .post('/updaterequestdata', {
                            UserID: correctuserid,
                            Request: request,
                          })
                          .then(function (response) {
                            console.log(response)
                          })
                          .catch(function (error) {
                            console.log(error)
                            modal[2].style.display = 'none'
                          })
                      }
                    })
                  }
                })
                .catch(function (error) {
                  console.log(error)
                  modal[2].style.display = 'none'
                })
            })

            axios
              .post('/updatedocumentstatus', {
                DocumentID: correctuserid,
                Status: 'Correcting',
              })
              .then(function (response) {
                console.log(response)
                if (
                  response.data === 'insert done' ||
                  response.data === 'update done'
                ) {
                  //alert('Document Correcting');
                  setTimeout(function () {
                    modal[2].style.display = 'none'
                    DataVar.RecepientArray = dbpeople
                    var wurl =
                      '#/admin/uploadsuccess?id=' +
                      fileid +
                      '&u=' +
                      correctuserid +
                      '&docname=' +
                      docname +
                      '&action=correct'
                    window.location.hash = wurl
                  }, 3000)
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
          modal[2].style.display = 'none'
        })
    })

    $(document).on('click', '.create', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var createuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var createuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              dbpeople.push({
                name: data.RecepientName,
                email: data.RecepientEmail,
                option: data.RecepientOption,
              })
              //console.log(dbpeople);
            })
            DataVar.RecepientArray = dbpeople
            docname = Document.DocumentName

            var newdocid = randomString(13)

            axios
              .post('/docdownload', {
                UserID: createuserid,
                filename: fileid,
              })
              .then(function (response) {
                console.log(response)
                if (response.data.Status === 'doc found') {
                  var doc = response.data.data

                  //console.log(doc);

                  DataVar.DocName = docname
                  DataVar.DataURI = doc
                  DataVar.DataPath = doc
                  modal[2].style.display = 'none'
                  var wurl =
                    '#/admin/uploadsuccess?id=' +
                    fileid +
                    '&u=' +
                    createuserid +
                    '&docname=' +
                    docname +
                    '&action=create'
                  window.location.hash = wurl
                }
              })
              .catch(function (error) {
                console.log(error)
                modal[2].style.display = 'none'
              })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $(document).on('click', '.savetemplate', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[2].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().parent().children('#datastatus')[0].innerHTML);
        var templateuserid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datakey')[0].innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var templateuserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      var docname = ''

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              dbpeople.push({
                name: data.RecepientName,
                email: data.RecepientEmail,
                option: data.RecepientOption,
              })
              //console.log(dbpeople);
            })

            TemplateDataVar.TemplateID = fileid
            TemplateDataVar.TemplateUserID = templateuserid
            TemplateDataVar.TemplateRecepientCount = dbpeople.length
            TemplateDataVar.TemplateRecepientArray = dbpeople

            modal[2].style.display = 'none'
            var wurl = '#/admin/saveastemplate'
            window.location.hash = wurl
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $(document).on('click', '.resend', function () {
      $('.dropdown-menu2').css({ display: 'none' })
      modal[1].style.display = 'block'
      try {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var resenduserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      } catch (error) {
        //console.log($(this).parent().parent().parent().children('#datakey')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datauid')[0].innerHTML);
        //console.log($(this).parent().parent().parent().children('#datastatus')[0].innerHTML);
        var resenduserid = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datauid')[0].innerHTML
        var fileid = $(this).parent().parent().parent().children('#datakey')[0]
          .innerHTML
        var status = $(this)
          .parent()
          .parent()
          .parent()
          .children('#datastatus')[0].innerHTML
      }

      axios
        .post('/getdocdata', {
          DocumentID: fileid,
        })
        .then(function (response) {
          console.log(response)
          if (response.data.Status === 'doc data done') {
            var Document = response.data.Document
            var dbpeople = []
            Document.Reciever.forEach(function (data, index) {
              var url =
                process.env.REACT_APP_BASE_URL +
                '/#/admin/sign?id=' +
                fileid +
                '&type=db&u=' +
                resenduserid +
                '&key=' +
                index +
                ''
              if (data.RecepientStatus === 'Sent') {
                var dbpeople = []
                dbpeople.push({
                  name: data.RecepientName,
                  email: data.RecepientEmail,
                  option: data.RecepientOption,
                })
                //console.log(dbpeople);

                axios
                  .post('/sendmail', {
                    to: data.RecepientEmail,
                    body:
                      `<!doctype html><html> <head> <meta name="viewport" content="width=device-width"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>PappayaSign Sign Request</title> <style> @media only screen and (max-width: 620px) { table[class=body] h1 { font-size: 28px !important; margin-bottom: 10px !important; } table[class=body] p, table[class=body] ul, table[class=body] ol, table[class=body] td, table[class=body] span, table[class=body] a { font-size: 16px !important; } table[class=body] .wrapper, table[class=body] .article { padding: 10px !important; } table[class=body] .content { padding: 0 !important; } table[class=body] .container { padding: 0 !important; width: 100% !important; } table[class=body] .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } table[class=body] .btn table { width: 100% !important; } table[class=body] .btn a { width: 100% !important; } table[class=body] .img-responsive { height: auto !important; max-width: 100% !important; width: auto !important; } } /* ------------------------------------- PRESERVE THESE STYLES IN THE HEAD ------------------------------------- */ @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } .btn-primary table td:hover { background-color: #626262 !important; } .btn-primary a:hover { background-color: #626262 !important; border-color: #626262 !important; } } </style> </head> <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"> <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;"> <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;"> <!-- START CENTERED WHITE CONTAINER --> <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">PappayaSign</span> <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;"> <!-- START MAIN CONTENT AREA --> <tr> <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;"> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello, ` +
                      data.RecepientName +
                      `</p> <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">We have a sign request for you. </p> <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;"> <tbody> <tr> <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="` +
                      url +
                      `" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d35400; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d35400;">Review Envelope</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px; Margin-top: 15px;"><strong>Do Not Share The Email</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email consists a secure link to PappayaSign, Please do not share this email, link or access code with others.</p> <p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>About PappayaSign</strong></p> <p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">Sign document electronically in just minutes, It's safe, secure and legally binding. Whether you're in an office, at home, on the go or even across the globe -- PappayaSign provides a proffesional trusted solution for Digital Transaction Management.</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Questions about the Document?</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">If you need to modify the document or have questions about the details in the document, Please reach out to the sender by emailing them directly</p><p style="font-family: sans-serif; font-size: 12px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 5px;"><strong>Terms and Conditions.</strong></p><p style="font-family: sans-serif; font-size: 11px; color:#727272; font-weight: normal; margin: 0; Margin-bottom: 15px;">By clicking on link / review envelope , I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on envelopes,including legally binding contracts - just the same as a pen-and-paper signature or initial.</p> </td> </tr> </table> </td> </tr> <!-- END MAIN CONTENT AREA --> </table> <!-- START FOOTER --> <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;"> <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"> <tr> <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;"> Powered by <a href="http://www.pappaya.com" style="color: #d35400; font-size: 12px; text-align: center; text-decoration: none;">Pappaya</a>. </td> </tr> </table> </div> <!-- END FOOTER --> <!-- END CENTERED WHITE CONTAINER --> </div> </td> <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td> </tr> </table> </body></html>`,
                    subject: 'PappayaSign: Sign Request',
                  })
                  .then(function (response) {
                    console.log(response)
                    //firebase.database().ref(voiduserid + '/Documents/'+voidfileid+'/Reciever/'+childdata.key+'/').child('RecepientStatus').set('Void');
                  })
                  .catch(function (error) {
                    //console.log('message could not be sent');
                  })
              }
              inboxfunc()
              datafunc()
              modal[1].style.display = 'none'
              //console.log('Document Resent');
              alert('Document Resent')
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    })

    $('#startnowbtn').click(function () {
      window.location.hash = '#/admin/startdrop'
    })

    var randomString = function (len, bits) {
      bits = bits || 36
      var outStr = '',
        newStr
      while (outStr.length < len) {
        newStr = Math.random().toString(bits).slice(2)
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length))
      }
      return outStr.toUpperCase()
    }


    window.onclick = function (e) {
      if (e.target == modal[5]) {
        modal[5].style.display = 'none'
      }
    }

  }
  render() {
    return (
      <>
        <HeaderDefault />
        {/* Page content */}
        <div className="mt--8 mx-4">
          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait while we fetch your details.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Sending.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <p>Please wait.</p>
                <div className="lds-dual-ring"></div>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>
                    By voiding this envelope, recipients can no longer view it
                    or sign enclosed documents. Recipients will receive an email
                    notification, which includes your reason for voiding the
                    envelope.{' '}
                  </h5>
                </div>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <span className="emaillabelspan">
                        <strong>*Reason for voiding document.</strong>
                      </span>
                      <Input
                        className="form-control-alternative"
                        id="managevoidmessage"
                        placeholder="Email message"
                        type="textarea"
                        rows="3"
                      />
                    </FormGroup>
                  </Col>

                  <Col lg="6">
                    <Button
                      id="managevoidapprovebtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Void
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="managevoidcancelbtn"
                      className="cancel-btn float-left px-4"
                    >
                      {' '}
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>
                    Are you sure you want to delete this document? Deleting your
                    in progress envelopes will void them and notify current
                    recipients of the changes. You can find all your deleted
                    envelopes in your Deleted bin for a short time before
                    they're removed permanently.{' '}
                  </h5>
                </div>
                <Row>
                  <Col lg="6">
                    <Button
                      id="managedeleteapprovebtn"
                      className="close-btn float-right px-4"
                    >
                      {' '}
                      Delete
                    </Button>
                  </Col>
                  <Col lg="6">
                    <Button
                      id="managedeletecancelbtn"
                      className="cancel-btn float-left px-4"
                    >
                      {' '}
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="modal">
            <div className="modal-content-history">
              <div>
                <div className="mb-4 mb-xl-0">
                  <h5>
                    History
                  </h5>
                </div>
                <Row>
                  <Col lg="12">
                  <Table
                    className="align-items-center table-flush"
                    id="historytable"
                  >
                    <thead className="thead-primary">
                      <tr>
                        <th scope="col">Time</th>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                        <th scope="col">Activity</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </Table>
                  </Col>
                  
                </Row>
              </div>
            </div>
          </div>


          

          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Manage</h3>
                </CardHeader>

                <CardBody className="bg-secondary" id="managebody">
                  <Row>
                    <Col lg="3">
                      <div
                        id="managebtncontainer"
                        className="managebtncontainer"
                      >
                        <Button
                          className="my-3 fullwidth p-2"
                          color="primary"
                          size="mg"
                          type="button"
                          id="startnowbtn"
                        >
                          Start Now
                        </Button>

                        <div className="divider" id="customfieldscolumn">
                          <div className="col my-3 p-2">
                            <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
                              Envelope
                            </h6>
                          </div>
                          <hr className="my-1" />
                        </div>

                        <Button
                          aria-selected={this.state.tabs === 1}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 1,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 1)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="inboxbtn"
                          outline
                        >
                          <i className="material-icons">inbox</i>
                          Inbox
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 2}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 2,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 2)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="sentbtn"
                          outline
                        >
                          <i className="material-icons">send</i>
                          Sent
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 3}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 3,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 3)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="draftsbtn"
                          outline
                        >
                          <i className="material-icons">drafts</i>
                          Drafts
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 4}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 4,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 4)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="deletedbtn"
                          outline
                        >
                          <i className="material-icons">delete</i>
                          Deleted
                        </Button>

                        <div className="divider" id="customfieldscolumn">
                          <div className="col my-3 p-2">
                            <h6 className="text-uppercase text-gray ls-1 mb-3 pl-3 float-left">
                              Quick Views
                            </h6>
                          </div>
                          <hr className="my-1" />
                        </div>

                        <Button
                          aria-selected={this.state.tabs === 5}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 5,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 5)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="waitingbtn"
                          outline
                        >
                          <i className="material-icons">query_builder</i>
                          Waiting for Others
                        </Button>

                        <Button
                          aria-selected={this.state.tabs === 6}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 6,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 6)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="actionrequiredbtn"
                          outline
                        >
                          <i className="material-icons">error</i>
                          Action Required
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 7}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 7,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 7)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="completedbtn"
                          outline
                        >
                          <i className="material-icons">done</i>
                          Completed
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 8}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 8,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 8)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="expiringbtn"
                          outline
                        >
                          <i className="material-icons">error</i>
                          Expiring Soon
                        </Button>
                        <Button
                          aria-selected={this.state.tabs === 9}
                          className={classnames('my-1 fullwidth', {
                            active: this.state.tabs === 9,
                          })}
                          onClick={(e) => this.toggleNavs(e, 'tabs', 9)}
                          href="#pablo"
                          color="primary"
                          size="sm"
                          type="button"
                          id="authbtn"
                          outline
                        >
                          <i className="material-icons">warning</i>
                          Authentication Failed
                        </Button>
                      </div>
                    </Col>
                    <Col lg="9">
                      <TabContent
                        activeTab={'tabs' + this.state.tabs}
                        id="tabcontent"
                        className="managetabcontent"
                      >
                        <TabPane tabId="tabs1" className="managetabpane">
                          <Table
                            className=" align-items-center table-flush"
                            id="alltable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs2" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="senttable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>

                        <TabPane tabId="tabs3" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="draftstable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>

                        <TabPane tabId="tabs4" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="deletedtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs5" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="waitingtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs6" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="actionrequiredtable"
                            responsive
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs7" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="completedtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs8" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="expiringtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                        <TabPane tabId="tabs9" className="managetabpane">
                          <Table
                            className="align-items-center table-flush"
                            id="authtable"
                          >
                            <thead className="thead-primary">
                              <tr>
                                <th scope="col"></th>
                                <th scope="col">Subject</th>
                                <th scope="col">Status</th>
                                <th scope="col">Last Change</th>
                                <th scope="col"></th>
                              </tr>
                            </thead>
                            <tbody></tbody>
                          </Table>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
                <CardBody id="detailbody">
                  <Row>
                    <Col lg="12">
                      <Button
                        color="primary"
                        size="sm"
                        type="button"
                        className="px-4"
                        id="detailbackbtn"
                      >
                        Back
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        type="button"
                        className="float-right"
                        id="detaildownloadbtn"
                      >
                        Download
                      </Button>
                      <Button
                        color="primary"
                        size="sm"
                        type="button"
                        className="float-right"
                        id="detailprintbtn"
                      >
                        Print
                      </Button>
                    </Col>
                    <Col lg="12">
                      <h4 className="py-4 px-3" color="dark">
                        Details:
                      </h4>
                    </Col>
                    <Col lg="6">
                      <Col lg="12">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Subject:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailsubject"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope ID:</strong>
                          </span>
                          <span className="emaillabelspan" id="detailid"></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Sent:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailsent"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Date Created:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailcreate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="6">
                      <Col lg="12">
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Holder:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailholder"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Envelope Recipients:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailrecepients"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailstatus"
                          ></span>
                        </FormGroup>
                        <FormGroup>
                          <span className="emaillabelspan">
                            <strong>Status Date:</strong>
                          </span>
                          <span
                            className="emaillabelspan"
                            id="detailstatusdate"
                          ></span>
                        </FormGroup>
                      </Col>
                    </Col>
                    <Col lg="12">
                      <h4 className="py-4 px-3" color="dark">
                        Recepients:
                      </h4>
                      <div className="managerecepientstable">
                        <ul id="managerecepientstable"></ul>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </div>
          </Row>
        </div>
      </>
    )
  }
}

export default Tables
