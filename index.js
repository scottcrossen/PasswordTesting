const fs = require('fs')
const _ = require('underscore')
var md5 = require('nano-md5')

const PASSWORDS_FILE = 'passwords.txt'
const PASSWD_FILE_OUT = 'passwd.txt'
const SHADOW_FILE_OUT = 'shadow.txt'
const USERNAME_PREFIX = 'user'
const LAST_PASSWORD_CHANGE = '17082'
const PASS_CHANGE_WAIT_DAYS = 0
const PASS_EXPERIATION_DAYS = 99999
const PASS_EXPERIATION_NOTICE = 7
const INACTIVE = ''
const EXPIRE = ''
const USER_COMMENTS = ''
const USER_DIRECTORY = ''
const USER_SHELL = '/user/sbin/nologin'

fs.readFile(PASSWORDS_FILE, (err, data) => {
  if (err) {
    console.log('Something is wrong with the password file. Does it exist?')
  } else {
    const FILE_IN = data
        .toString()
        .split('\n')
        .filter((line) => !(/^\s*(#|$)/.test(line)))
        .map((line) => line.replace(/^\s+|\s+$/g, ''))
    const SHADOW_FILE = _.map(FILE_IN, (pass, index) =>
      [
        USERNAME_PREFIX + (index + 1).toString(),
        md5.crypt(pass),
        LAST_PASSWORD_CHANGE,
        PASS_CHANGE_WAIT_DAYS,
        PASS_EXPERIATION_DAYS,
        PASS_EXPERIATION_NOTICE,
        INACTIVE,
        EXPIRE
      ].map((element) => element.toString()).join(':') + ':'
    ).join('\n')
    const PASSWD_FILE = _.map(FILE_IN, (pass, index) =>
      [
        USERNAME_PREFIX + (index + 1).toString(),
        'x',
        index + 1,
        index + 1,
        USER_COMMENTS,
        USER_DIRECTORY,
        USER_SHELL
      ].map((element) => element.toString()).join(':')
    ).join('\n')
    fs.writeFile(PASSWD_FILE_OUT, PASSWD_FILE, function (err) {
      if (err) {
        console.log('Could not save password file')
      } else {
        console.log('Successfully saved password file')
      }
    })
    fs.writeFile(SHADOW_FILE_OUT, SHADOW_FILE, function (err) {
      if (err) {
        console.log('Could not save shadow file')
      } else {
        console.log('Successfully saved shadow file')
      }
    })
  }
})
