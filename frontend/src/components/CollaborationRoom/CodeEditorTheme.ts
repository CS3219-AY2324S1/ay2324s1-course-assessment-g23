import { HighlightStyle } from '@codemirror/language'
import { tags } from '@lezer/highlight'

import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

// Code editor theme is referenced from
// https://github.com/ivqonsanada/codemirror6-themes
// https://github.com/upleveled/theme-vs-code-dark-plus

const ivory = '#abb2bf',
    darkBackground = '#21252b',
    highlightBackground = '#242424',
    background = '#242424',
    tooltipBackground = '#353a42',
    selection = 'rgba(128, 203, 196, 0.2)',
    cursor = '#ffcc00',
    foreground = '#9cdcfe',
    invalid = '#ff0000',
    keyword = '#569cd6',
    controlFlowAndModuleKeywords = '#c586c0',
    functions = '#dcdcaa',
    typesAndClasses = '#4ec9b0',
    tagNames = '#569cd6',
    operators = '#d4d4d4',
    regexes = '#d16969',
    strings = '#ce9178',
    names = '#9cdcfe',
    punctuationAndSeparators = '#d4d4d4',
    angleBrackets = '#808080',
    templateStringBraces = '#569cd6',
    propertyNames = '#9cdcfe',
    booleansAndAtoms = '#569cd6',
    numbersAndUnits = '#b5cea8',
    metaAndComments = '#6a9955'

export const materialDarkerTheme = EditorView.theme(
    {
        '&': {
            color: '#eeffff',
            backgroundColor: background,
        },

        '.cm-content': {
            caretColor: cursor,
        },

        '&.cm-focused .cm-cursor': {
            borderLeftColor: cursor,
        },

        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: selection,
        },

        '.cm-panels': { backgroundColor: darkBackground, color: '#ffffff' },
        '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
        '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

        '.cm-searchMatch': {
            backgroundColor: '#72a1ff59',
            outline: '1px solid #457dff',
        },
        '.cm-searchMatch.cm-searchMatch-selected': {
            backgroundColor: '#6199ff2f',
        },

        '.cm-activeLine': { backgroundColor: highlightBackground },
        '.cm-selectionMatch': { backgroundColor: '#aafe661a' },

        '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
            backgroundColor: '#bad0f847',
            outline: '1px solid #515a6b',
        },

        '.cm-gutters': {
            background: background,
            color: '#545454',
            border: 'none',
        },

        '.cm-activeLineGutter': {
            backgroundColor: highlightBackground,
        },

        '.cm-foldPlaceholder': {
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ddd',
        },

        '.cm-tooltip': {
            border: 'none',
            backgroundColor: tooltipBackground,
        },
        '.cm-tooltip .cm-tooltip-arrow:before': {
            borderTopColor: 'transparent',
            borderBottomColor: 'transparent',
        },
        '.cm-tooltip .cm-tooltip-arrow:after': {
            borderTopColor: tooltipBackground,
            borderBottomColor: tooltipBackground,
        },
        '.cm-tooltip-autocomplete': {
            '& > ul > li[aria-selected]': {
                backgroundColor: highlightBackground,
                color: ivory,
            },
        },
    },
    { dark: true }
)

export const myHighlightStyle = HighlightStyle.define([
    { tag: tags.keyword, color: keyword },
    {
        tag: [tags.controlKeyword, tags.moduleKeyword],
        color: controlFlowAndModuleKeywords,
    },
    {
        tag: [tags.name, tags.deleted, tags.character, tags.macroName],
        color: names,
    },
    {
        tag: [tags.propertyName],
        color: propertyNames,
    },

    { tag: [tags.variableName, tags.labelName], color: names },
    {
        tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
        color: booleansAndAtoms,
    },
    { tag: [tags.definition(tags.name)], color: foreground },
    {
        tag: [
            tags.typeName,
            tags.className,
            tags.number,
            tags.changed,
            tags.annotation,
            tags.modifier,
            tags.self,
            tags.namespace,
        ],
        color: typesAndClasses,
    },
    { tag: [tags.tagName], color: tagNames },
    {
        tag: [tags.function(tags.variableName), tags.function(tags.propertyName)],
        color: functions,
    },
    { tag: [tags.number], color: numbersAndUnits },
    {
        tag: [
            tags.operator,
            tags.operatorKeyword,
            tags.url,
            tags.escape,
            tags.regexp,
            tags.link,
            tags.special(tags.string),
        ],
        color: operators,
    },
    {
        tag: [tags.regexp],
        color: regexes,
    },
    {
        tag: [tags.special(tags.string)],
        color: strings,
    },
    { tag: [tags.meta, tags.comment], color: metaAndComments },
    { tag: [tags.punctuation, tags.separator], color: punctuationAndSeparators },
    { tag: [tags.angleBracket], color: angleBrackets },
    { tag: tags.special(tags.brace), color: templateStringBraces },
    { tag: tags.strong, fontWeight: 'bold' },
    { tag: tags.emphasis, fontStyle: 'italic' },
    { tag: tags.strikethrough, textDecoration: 'line-through' },
    { tag: tags.link, color: metaAndComments, textDecoration: 'underline' },
    { tag: tags.heading, fontWeight: 'bold', color: names },
    {
        tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
        color: booleansAndAtoms,
    },
    {
        tag: [tags.processingInstruction, tags.string, tags.inserted],
        color: strings,
    },
    { tag: tags.invalid, color: invalid },
])

export const codeEditorTheme: Extension = [materialDarkerTheme]
