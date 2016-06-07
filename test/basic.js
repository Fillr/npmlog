var tap = require('tap')
var log = require('../')

var result = []
var logEvents = []
var logInfoEvents = []
var logPrefixEvents = []

var util = require('util')

var resultExpect =
[ '\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[7msill\u001b[0m \u001b[0m\u001b[35msilly prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[34m\u001b[40mverb\u001b[0m \u001b[0m\u001b[35mverbose prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[32minfo\u001b[0m \u001b[0m\u001b[35minfo prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[32m\u001b[40mhttp\u001b[0m \u001b[0m\u001b[35mhttp prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[30m\u001b[43mWARN\u001b[0m \u001b[0m\u001b[35mwarn prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35merror prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[32minfo\u001b[0m \u001b[0m\u001b[35minfo prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[32m\u001b[40mhttp\u001b[0m \u001b[0m\u001b[35mhttp prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[30m\u001b[43mWARN\u001b[0m \u001b[0m\u001b[35mwarn prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35merror prefix\u001b[0m x = {"foo":{"bar":"baz"}}\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35m404\u001b[0m This is a longer\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35m404\u001b[0m message, with some details\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35m404\u001b[0m and maybe a stack.\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u001b[31m\u001b[40mERR!\u001b[0m \u001b[0m\u001b[35m404\u001b[0m \n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u0007noise\u001b[0m\u001b[35m\u001b[0m LOUD NOISES\n',
  '\u001b[0m\u001b[37m\u001b[40mnpm\u001b[0m \u001b[0m\u0007noise\u001b[0m \u001b[0m\u001b[35merror\u001b[0m erroring\n',
  '\u001b[0m' ]

var logPrefixEventsExpect =
[ { id: 2,
    level: "info",
    prefix: "info prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 6,
    level: "info",
    prefix: "info prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] } ]

// should be the same.
var logInfoEventsExpect = logPrefixEventsExpect

var logEventsExpect =
[ { id: 0,
    level: "silly",
    prefix: "silly prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { "foo": { "bar": "baz" } } ] },
  { id: 1,
    level: "verbose",
    prefix: "verbose prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { "foo": { "bar": "baz" } } ] },
  { id: 2,
    level: "info",
    prefix: "info prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 3,
    level: "http",
    prefix: "http prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 4,
    level: "warn",
    prefix: "warn prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 5,
    level: "error",
    prefix: "error prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 6,
    level: "info",
    prefix: "info prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 7,
    level: "http",
    prefix: "http prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 8,
    level: "warn",
    prefix: "warn prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 9,
    level: "error",
    prefix: "error prefix",
    message: "x = {\"foo\":{\"bar\":\"baz\"}}",
    messageRaw: [ "x = %j", { foo: { bar: "baz" } } ] },
  { id: 10,
    level: "error",
    prefix: "404",
    message: "This is a longer\nmessage, with some details\nand maybe a stack.\n",
    messageRaw: [ "This is a longer\nmessage, with some details\nand maybe a stack.\n" ] },
  { id: 11,
    level: "noise",
    prefix: "",
    message: "LOUD NOISES",
    messageRaw: [ "LOUD NOISES" ] },
  { id: 12,
    level: "noise",
    prefix: "error",
    message: "erroring",
    messageRaw: [ "erroring" ] }
]

var Stream = require('stream').Stream
var s = new Stream()
s.write = function (m) {
  result.push(m)
}

s.writable = true
s.isTTY = true
s.end = function () {}

log.stream = s

log.heading = 'npm'


tap.test('basic', function (t) {
  log.on('log', logEvents.push.bind(logEvents))
  log.on('log.info', logInfoEvents.push.bind(logInfoEvents))
  log.on('info prefix', logPrefixEvents.push.bind(logPrefixEvents))

  console.error('log.level=silly')
  log.level = 'silly'
  log.silly('silly prefix', 'x = %j', {foo:{bar:'baz'}})
  log.verbose('verbose prefix', 'x = %j', {foo:{bar:'baz'}})
  log.info('info prefix', 'x = %j', {foo:{bar:'baz'}})
  log.http('http prefix', 'x = %j', {foo:{bar:'baz'}})
  log.warn('warn prefix', 'x = %j', {foo:{bar:'baz'}})
  log.error('error prefix', 'x = %j', {foo:{bar:'baz'}})
  log.silent('silent prefix', 'x = %j', {foo:{bar:'baz'}})

  console.error('log.level=silent')
  log.level = 'silent'
  log.silly('silly prefix', 'x = %j', {foo:{bar:'baz'}})
  log.verbose('verbose prefix', 'x = %j', {foo:{bar:'baz'}})
  log.info('info prefix', 'x = %j', {foo:{bar:'baz'}})
  log.http('http prefix', 'x = %j', {foo:{bar:'baz'}})
  log.warn('warn prefix', 'x = %j', {foo:{bar:'baz'}})
  log.error('error prefix', 'x = %j', {foo:{bar:'baz'}})
  log.silent('silent prefix', 'x = %j', {foo:{bar:'baz'}})

  console.error('log.level=info')
  log.level = 'info'
  log.silly('silly prefix', 'x = %j', {foo:{bar:'baz'}})
  log.verbose('verbose prefix', 'x = %j', {foo:{bar:'baz'}})
  log.info('info prefix', 'x = %j', {foo:{bar:'baz'}})
  log.http('http prefix', 'x = %j', {foo:{bar:'baz'}})
  log.warn('warn prefix', 'x = %j', {foo:{bar:'baz'}})
  log.error('error prefix', 'x = %j', {foo:{bar:'baz'}})
  log.silent('silent prefix', 'x = %j', {foo:{bar:'baz'}})
  log.error('404', 'This is a longer\n'+
                   'message, with some details\n'+
                   'and maybe a stack.\n')
  log.addLevel('noise', 10000, {beep: true})
  log.noise(false, 'LOUD NOISES')
  log.noise('error', 'erroring')

  console.log(JSON.stringify(logInfoEvents, null, 2))

  t.deepEqual(result.join('').trim(), resultExpect.join('').trim(), 'result')
  t.deepEqual(log.record, logEventsExpect, 'record')
  t.deepEqual(logEvents, logEventsExpect, 'logEvents')
  t.deepEqual(logInfoEvents, logInfoEventsExpect, 'logInfoEvents')
  t.deepEqual(logPrefixEvents, logPrefixEventsExpect, 'logPrefixEvents')

  t.end()
})
