# EasyFilterParser

🎈 Welcome to **EasyFilterParser**! 👋

EasyFilterParser is a lightweight ☁️, zero dependencies 🚢, minimal setup 😮, intuitive 😃 and powerful 💪 parser used in the EasyFilter trilogy packages.

It's as easy as this:
```js
  const parser = EasyFilterParser()
  const { options, searchTree } = parser.search('your query')
```

## Get Started

### Use your choice of package manager

```bash
npm install @noriller/easy-filter-parser
```

```bash
yarn add @noriller/easy-filter-parser
```

### Then import it with the syntax of your choice

```js
import EasyFilterParser from '@noriller/easy-filter-parser'
```

```js
const EasyFilterParser = require('@noriller/easy-filter-parser')
```

### Finally, to actually use it

```js
  const parser = EasyFilterParser()
  const { options, searchTree } = parser.search('your query')
```

That's it! 🧙‍♂️

Check out the section [EasyFilterParser Operators](#easyfilter-parser-operators) to see all that you can pass to the filter, the real ✨magic✨ is there!

```js
✨ Magic like turning this:
  `search for something "this between quotes" and then here:"you search for this"`
✨
  Into something that works for single values, quoted values and even values nested inside keys. AND MORE!
✨
```

#### Really? That's it?

Ok. If you need more options, here's the full setup you can do using all options available:

```js
const parser = EasyFilterParser({
    filterOptions: {
      dateFormat: 'DD-MM-YYYY',
      normalize: true,
      indexing: true,
      limit: 10,
    },
    tagAliases: {
      tag: ['tag1', 'tag2', 'tag3'],
    }
  })

const { options, searchTree } = parser.search('your query')
```

It's still that simple. 👨‍💻

All the options will be explained in [EasyFilterParser Options](#easyfilter-parser-options).
And most of them you can pass in the `search` 🔎 string when you need.

## Inspirations and motivation

In corporate scenarios, sometimes we have too much information 😵. We make pages with endless columns and if we need to filter that data, we either use something generic like `Object.keys(object).join(' ').includes('string')` or we have to make a custom search... for. each. table. 😫

Meanwhile I saw awesome (and probably custom solutions) in things we use everyday.

Check out the ones I was aiming for 🌟:
* Github
* Stackoverflow
* Gmail/Google Search

In the latter, users can use their UI to create their queries while powerusers can just type that and much more.

I too needed to provide a way to users to filter the data and ended up settling at a simpler version of this project. Mostly because of all the solutions I was able to find were neither user or developer friendly. 😢

(Also a little rant: `search`, `filter`, `matcher` and the like are a nightmare to search for... too many hits and too little relevant results 😕)

This is what I'm trying to offer here: a powerful engine to make your queries. 😎👍

Then it's up to you to offer a UI for what makes sense for your data. And it's still intuitive for common users and powerful for powerusers.

## EasyFilterParser Operators

Most of this should be intuitive for most users... that's what I was aiming for after all. 🧐
### OR query

Any word or operators are, primarily and lastly, treated as `OR` queries.

```js
parser.search('word1 word2 tag:value "quoted value"')
```
```js
// Returns:
{
  options: {},
  searchTree: [
      {
        payload: 'quoted value',
        mode: 'QUOTE',
        childs:
          [
            { payload: 'quoted', mode: 'OR', childs: undefined },
            { payload: 'value', mode: 'OR', childs: undefined }
          ]
      },
      {
        payload: 'value',
        tag: 'tag',
        mode: 'TAG',
        childs: [{ payload: 'value', mode: 'OR', childs: undefined }],
        aliases: {}
      },
      { payload: 'word1', mode: 'OR', childs: undefined },
      { payload: 'word2', mode: 'OR', childs: undefined }
    ]
}
```
`word1`, `word2`, `tag:value` and `"quoted value"` each become separated entities.

### AND query

Anything inside quotes (either double `"` or single `'`) will be treated as one entity.

```js
parser.search('"quoted value tag:value"')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'quoted value tag:value',
      mode: 'QUOTE',
      childs:
        [
          {
            payload: 'value',
            tag: 'tag',
            mode: 'TAG',
            childs: [{ payload: "value", mode: "OR" }],
            aliases: {}
          },
          { payload: 'quoted', mode: 'OR', childs: undefined },
          { payload: 'value', mode: 'OR', childs: undefined }
        ]
    }]
}
```
`quoted`, `value` and `tag:value` became an `AND` query.

And in this case, both `quoted` and `value` become `OR` queries and `tag:value` becomes `TAG` query.

#### AND Remarks

An `AND` query can contain: `OR`, `TAG` and even nested `AND` queries.

In case of nested `TAG` and `AND` queries, the nested quote must not match the parent quote.

### TAG query

TAG here is equivalent to any `key` of a Javascript object.

#### TAG Remarks

A `TAG` query can contain: `OR`, `AND` and then `NULL` and `RANGE`/`DATE_RANGE` queries.

`TAG` doesn't support nested `TAG` queries.

#### Types of TAG queries with Examples:
##### TAG - Simple
```js
parser.search('tag:value')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'value',
      tag: 'tag',
      mode: 'TAG',
      childs: [{ payload: 'value', mode: 'OR', childs: undefined }],
      aliases: {}
    }]
}
```
Just the `TAG` followed by a colon and the `value`.

`value` in this example will become an `OR` query.

##### TAG - OR
```js
parser.search('tag:(value1 value2 value3)')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'value1 value2 value3',
      tag: 'tag',
      mode: 'TAG',
      childs:
        [
          { payload: 'value1', mode: 'OR', childs: undefined },
          { payload: 'value2', mode: 'OR', childs: undefined },
          { payload: 'value3', mode: 'OR', childs: undefined }
        ],
      aliases: {}
    }]
}
```
By using brackets, you can have an `OR` query with multiple values at once.

##### TAG - AND
```js
parser.search('tag:"value1 value2 value3"')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: '"value1 value2 value3"',
      tag: 'tag',
      mode: 'TAG',
      childs:
        [{
          payload: 'value1 value2 value3',
          mode: 'QUOTE',
          childs: [
            { payload: "value1", mode: "OR" },
            { payload: "value2", mode: "OR" },
            { payload: "value3", mode: "OR" }
          ]
        }],
      aliases: {}
    }]
}
```
By using quotes (single/double), you can have an `AND` query.

##### TAG - Null Values
```js
parser.search('tag:null tag:nil tag:none tag:nothing')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [
      {
        payload: 'null',
        tag: 'tag',
        mode: 'TAG_NULL',
        childs: [{ payload: 'null', mode: 'OR', childs: undefined }],
        aliases: {}
      },
      {
        payload: 'nil',
        tag: 'tag',
        mode: 'TAG_NULL',
        childs: [{ payload: 'nil', mode: 'OR', childs: undefined }],
        aliases: {}
      },
      {
        payload: 'none',
        tag: 'tag',
        mode: 'TAG_NULL',
        childs: [{ payload: 'none', mode: 'OR', childs: undefined }],
        aliases: {}
      },
      {
        payload: 'nothing',
        tag: 'tag',
        mode: 'TAG_NULL',
        childs: [{ payload: 'nothing', mode: 'OR', childs: undefined }],
        aliases: {}
      }
    ]
}
```
By passing, alone, any of the words: `NULL`, `NIL`, `NONE` or `NOTHING` as the value of the `TAG`, it will create a `TAG_NULL` that can be used to search nullish values.

`tag:(nothing)`, in contrast, will create a normal `TAG` query.

##### TAG - Chaining Tags
```js
parser.search('tag.subTag.thirdTag:value')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'value',
      tag: 'tag.subTag.thirdTag',
      mode: 'TAG',
      childs: [{ payload: 'value', mode: 'OR', childs: undefined }],
      aliases: {}
    }]
}
```
You can chain tags together using a `.` (full stop/period).

This would be equivalent to nested `TAGs`. (Nested tags aren't supported.)

##### TAG - Arrays
```js
parser.search('tag.0:value tag2.*.subTag:value')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [
      {
        payload: 'value',
        tag: 'tag.0',
        mode: 'TAG',
        childs: [{ payload: 'value', mode: 'OR', childs: undefined }],
        aliases: {}
      },
      {
        payload: 'value',
        tag: 'tag2.*.subTag',
        mode: 'TAG',
        childs: [{ payload: 'value', mode: 'OR', childs: undefined }],
        aliases: {}
      }
    ]
}
```
As a use case in [EasyFilter](https://www.npmjs.com/package/@noriller/easy-filter), arrays are supported.

The main difference is that the `key` they use are numerical and ordered.

`tag.0:value` and `tag2.*.subTag:value` have the same syntax as a normal chaining and the difference will happen in the filter implementation.

##### TAG - RANGE
```js
parser.search('tag:range(0,5)')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'range(0,5)',
      tag: 'tag',
      mode: 'TAG',
      childs:
        [{
          payload: null,
          range: [0, 5],
          mode: 'RANGE',
          childs: undefined
        }],
      aliases: {}
    }]
}
```
By passing, alone, the operator `RANGE()` you can pass one or two arguments that will filter based on the numbers.

`RANGE` can only be used inside `TAG` and with `number` values.

The first argument is the lower bound (`-Infinity` as default) and the second argument is the upper bound (`Infinity` as default).

Passing only one argument sets only the lower bound. To set only the upper bound, pass it empty: `RANGE(,5)`.

##### TAG - DATE_RANGE
```js
parser.search('tag:dateRange(2020-05-01, 2021-09-05)')
```
```js
//Returns:
{
  options: {},
  searchTree: [
    {
      aliases: {},
      childs: [
        {
          childs: undefined,
          mode: 'DATE_RANGE',
          payload: null,
          // the range return is actually: "2020-05-01T00:00:00.000Z","2021-09-05T00:00:00.000Z"
          // but it usually shows as a locale date string
          range: [new Date('2020-05-01'), new Date('2021-09-05')],
        },
      ],
      mode: 'TAG',
      payload: 'dateRange(2020-05-01, 2021-09-05)',
      tag: 'dates',
    },
  ],
}
```
By passing, alone, the operator `DATERANGE()` you can pass one or two arguments that will filter based on the dates.

`DATERANGE` can only be used inside `TAG` and with `date` values.

The first argument is the lower bound (`0000-01-01` as default) and the second argument is the upper bound (`9999-01-01` as default).

Passing only one argument sets only the lower bound. To set only the upper bound, pass it empty: `DATERANGE(,2021-09-05)`.

More on accepted `Date Formats` in [Date Format (Query)](#dateformat-query), but you can use all the common formats like `DD/MM/YYYY`, `MM/DD/YYYY` and `YYYY/MM/DD` as long as you pass it as an `OPTION`. If no `Date Format` is provided, the Javascript default implementation of `new Date('your date string')` will be used.

### NOT query

By nesting any and multiple queries inside the syntax `NOT()` you can invert those and it will NOT return anything that matches.

#### NOT Remarks

A `NOT` query can contain: `OR`, `AND` and `TAG` queries.

All `NOT` are parsed at the same level, nesting it inside other queries will just remove them from the query.

#### NOT Example:
```js
parser.search('not("quoted value tag:value")')
```
```js
//Returns:
{
  options: {},
  searcTree: [{
    payload: "\"quoted value tag:value\"",
    mode: "NOT",
    childs: [
      {
        payload: "quoted value tag:value",
        mode: "QUOTE",
        childs: [
          {
            payload: "value",
            tag: "tag",
            mode: "TAG",
            childs: [{ payload: "value", mode: "OR" }],
            aliases: {}
          },
          { payload: "quoted", mode: "OR" },
          { payload: "value", mode: "OR" }
        ]
      }
    ]
  }]
}
```

### EasyFilterParser Options

There's three types of options:
* Those that can be passed any time:
  * [Normalize](#normalize)
  * [Indexing](#indexing)
  * [Limit](#limit)
* Those that can only be passed in the setup:
  * [Filter Options](#filter-options)
    * [Date Format (Setup)](#dateformat-setup)
  * [Tag Aliases](#tag-aliases)
* Those that can only be passed with the query:
  * [Date Format (Query)](#dateformat-query)
#### OPTION keyword

Using the syntax `OPTION()` or `OPTIONS()` you can pass the following options inside your search string.

The `OPTION` keyword is parsed first, it will be just removed if nested in other queries and anything else inside will be either parsed as an option or ignored.

##### DATEFORMAT (Query)

When passed as an `OPTION`, `DateFormat` will be used to parse the dates used in [`DATE_RANGE`](#tag---date_range).

This way your users can use their locale date format in their query.

When using `DATE_RANGE`, if no `DateFormat` is passed as an option the Javascript default implementation of `new Date('your date string')` will be used.

The formats can be: `YYYY-MM-DD`, `DD-MM-YYYY` and `MM-DD-YYYY` while the separators can be: `-`, `.`, `,` and `/`.

###### DateFormat Example
```js
parser.search('tag:dateRange(30-12-2020,30-12-2022) option(dateFormat:DD.MM.YYYY)')
```
```js
//Returns:
{
  options: { dateFormatSearch: 'DD.MM.YYYY' },
  searchTree:
    [{
      payload: 'dateRange(30-12-2020,30-12-2022)',
      tag: 'tag',
      mode: 'TAG',
      childs:
        [{
          payload: null,
          range:
            [new Date('2020-12-30'), new Date('2022-12-30')],
          mode: 'DATE_RANGE',
          childs: undefined
        }],
      aliases: {}
    }]
}
```

##### NORMALIZE

When the `NORMALIZE` option is used, `EasyFilterParser` will discard/ignore every and all diacritics. It's FALSE by default.

This means that with `NORMALIZE`: `Crème brûlée` is equal to `Creme brulee`.

`EasyFilterParser` uses the [`string.normalize('NFD')`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) javascript API to decompose the strings and then remove all [Combining Diacritical Marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).

`NORMALIZE` uses a `boolean` flag, and when used in `OPTIONS` alone like `option(normalize)` it will assume the TRUE value, but you can explicitly use: `normalize:true`.

You can also use `normalize:false` to disable a [setup default](#filter-options) normalization for a specific query.

##### INDEXING

When the `INDEXING` option is used, the option can be used on the filter implementation to have a "relevance score" that you can use to sort the results. It's FALSE by default.

`INDEXING` uses a `boolean` flag, and when used in `OPTIONS` alone like `option(index)` or `option(indexing)` it will assume the TRUE value, but you can explicitly use: `index:true`.

You can also use `normalize:false` to disable a [setup default](#filter-options) indexing for a specific query.

##### LIMIT

When the `LIMIT` option is used, the option can be used on the filter implementation to return only the `LIMIT` number of results. It's Zero/FALSE by default.

`LIMIT` needs a `number` value, when used in `OPTIONS` you need to also pass a `number` value: `option(limit:1)`.

You can also use `limit:0` to disable a [setup default](#filter-options) limit for a specific query.
#### Setup Options

In the setup you may pass:
##### Filter Options

The following options works the same way as if passing in the query:
  * [Normalize](#normalize)
  * [Indexing](#indexing)
  * [Limit](#limit)

By passing it in the setup, they will be used in every `search`.

###### DATEFORMAT (Setup)

When passed in the `Setup`, `DateFormat` will be used to parse the dates in your `source` if your implementation uses it.

If no `DateFormat` is passed in the `setup`, the default implementation of dates will be used.

If that default implementation wouldn't work with your `source`, then provide a `DateFormat`.

The formats can be: `YYYY-MM-DD`, `DD-MM-YYYY` and `MM-DD-YYYY` while the separators can be: `-`, `.`, `,` and `/` (you can use the provided typing).

##### Tag Aliases

Pass `TAG Aliases` in the setup to expose to users more friendly (or broader) terms that they can call your data using `TAG`.

`Tag Aliases` should be a dictionary with `key`/`value` pairs where the `key` is what your users can use and the `value` is a array of strings that will refer to your actual data.

Our `data sources` might not always be the most user friendly, or something important might be nested where users couldn't possibly know. This is where you use `Tag Aliases`.

###### Aliases Examples

```js
const parse = EasyFilterParser({
    tagAliases: {
      // if you want more friendly aliases
      data: ['DT_0001X420'],
      name: ['nm_first', 'nm_last'],
      // if the important data is nested
      age: ['person.info.age'],
      // if your users expect to find everything related to a word
      address: ['address', 'city', 'country', 'province', 'zip_code'],
      // and you have no idea which words they will search for
      // just create multiple aliases with the same tags
      city: ['address', 'city', 'country', 'province', 'zip_code'],
      country: ['address', 'city', 'country', 'province', 'zip_code'],
      province: ['address', 'city', 'country', 'province', 'zip_code'],
      zip: ['address', 'city', 'country', 'province', 'zip_code'],
      location: ['address', 'city', 'country', 'province', 'zip_code'],
      where: ['address', 'city', 'country', 'province', 'zip_code'],
      position: ['address', 'city', 'country', 'province', 'zip_code'],
    }
  })
parse.search('data.address.name:something')
```
```js
//Returns:
{
  options: {},
  searchTree:
    [{
      payload: 'something',
      tag: 'data.address.name',
      mode: 'TAG',
      childs: [{ payload: 'something', mode: 'OR', childs: undefined }],
      aliases:
      {
        data: ['DT_0001X420'],
        name: ['nm_first', 'nm_last'],
        address: ['address', 'city', 'country', 'province', 'zip_code']
      }
    }]
}
```

## What else is there?

### Utils

Import with:
```js
import { removeDiacritics, cleanString, parseDate } from '@noriller/easy-filter-parser/utils'
```
OR
```js
const { removeDiacritics, cleanString, parseDate } = require('@noriller/easy-filter-parser/utils')
```

Inside there's also utils that will be used on the other packages (and that you can use too):
#### removeDiacritics

Use to remove diacritics from strings:

```js
removeDiacritics("Crème brûlée")
// returns: "Creme brulee"
```
#### cleanString

 Takes a string to be cleaned, trims it and removes double spaces.

 Then, if a removeString is provided, it also removes it from the stringToClean.

```js
cleanString('  string   dirty to be   cleaned  ', '   dirty   to   be   ')
 // returns: "string cleaned"
```
#### parseDate

Expect a string that should be a date and a `DateFormat` to return a [Date.UTC](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC) date.

If no `DateFormat` is specified, it returns the date as passed.

```js
parseDate('05-11-2020', "DD-MM-YYYY"); // returns the equivalent date as: '2020-11-05'
parseDate('05-11-2020', "MM-DD-YYYY"); // returns the equivalent date as: '2020-05-11'
parseDate('2020-11-05'); // just returns: '2020-11-05'
```

### Types

Types you use to instantiate `EasyFilterParser` are avaiable alongside the main import.

Import with:
```js
import EasyFilterParser, {
  DateFormat,
  OptionalParameters,
  SetupOptions,
  FilterOptions,
  TagAliases,
} from '@noriller/easy-filter-parser/types/shapes'
```
OR
```js
const EasyFilterParser, {
  DateFormat,
  OptionalParameters,
  SetupOptions,
  FilterOptions,
  TagAliases,
} = require('@noriller/easy-filter-parser/types/shapes')
```

Returns of the `search` method are avaiable by importing from:
```js
import {
  ParsedPart,
  ParsedRange,
  ParsedTag,
} from '@noriller/easy-filter-parser/types'
```
OR
```js
const {
  ParsedPart,
  ParsedRange,
  ParsedTag,
} = require('@noriller/easy-filter-parser/types')
```

## What's next?

Here's something you can expect in the future:

* `EasyFilterParser` will be the base of a `EasyFilter` trilogy:
  * [EasyFilter](https://www.npmjs.com/package/@noriller/easy-filter) that filters Javascript objects.
  * `EasyFilterParser-SQL` - That will create SQL queries. (I'm working on this now!)
  * `EasyFilterParser-Mongo` - That will create Mongo queries. (TBD)

## There's a problem or it could be better

Either if you're encountered a problem: 😢 or if you're have an idea to make it better: 🤩

Feel free to contribute, to open issues, bug reports or just to say hello! 🤜🤛


In case of bugs or errors, if possible, send an example of the query you're using and what you've expected.

Since it supports any kind of queries... who knows what can happen?

## Work with me!

https://www.linkedin.com/in/noriller/

### Hit me up at Discord!

https://discord.gg/XtNPk7HeCa
### Or Donate:

* [$5 Nice job! Keep it up.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5)
* [$10 I really liked that, thank you!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10)
* [$42 This is exactly what I was looking for.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=42)
* [$1K WOW. Did not know javascript could do that!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=1000)
* [$5K I need something done ASAP! Can you do it for yesterday?](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5000)
* [$10K Please consider this: quit your job and work with me!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10000)
* [$??? Shut up and take my money!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD)

## That’s it! 👏