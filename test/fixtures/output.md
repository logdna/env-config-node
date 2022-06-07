## Environment Variables

### `FAKE_PORT`

> A fake service port, coerced into a number from process.env.FAKE_PORT

| Config | Value |
| --- | --- |
| Name | `fake-port` |
| Environment Variable | `FAKE_PORT` |
| Type | `number` |
| Required | no |
| Default | `3000` |
| Allows Empty Values | `false` |
| Min | `1025` |
| Max | `655359` |

***

### `MIGHT_BE_EMPTY`

> Assigns the default value if the env var is omitted. Also allows the empty string as a value.

| Config | Value |
| --- | --- |
| Name | `might-be-empty` |
| Environment Variable | `MIGHT_BE_EMPTY` |
| Type | `string` |
| Required | no |
| Default | `you entered nothing` |
| Allows Empty Values | `true` |

***

### `MY_BOOLEAN`

> process.env.MY_BOOLEAN truthy/falsey values are coerced into a boolean

| Config | Value |
| --- | --- |
| Name | `my-boolean` |
| Environment Variable | `MY_BOOLEAN` |
| Type | `boolean` |
| Required | no |
| Default | `false` |
| Allows Empty Values | `false` |

***

### `MY_ENUM`

> One value from a list of allowable values

| Config | Value |
| --- | --- |
| Name | `my-enum` |
| Environment Variable | `MY_ENUM` |
| Type | `enum` |
| Required | no |
| Default | `value3` |
| Allows Empty Values | `false` |
| Possible Values | `value1`<br>`value2`<br>`value3`<br> |

***

### `MY_STRING`

> This is a fake required string which has no possible default

| Config | Value |
| --- | --- |
| Name | `my-string` |
| Environment Variable | `MY_STRING` |
| Type | `string` |
| Required | **yes** |
| Default | `(none)` |
| Allows Empty Values | `false` |

***

### `REGEX_VALUE`

> The value found in process.env.REGEX_VALUE shoudl match the pattern

| Config | Value |
| --- | --- |
| Name | `regex-value` |
| Environment Variable | `REGEX_VALUE` |
| Type | `regex` |
| Required | no |
| Default | `(none)` |
| Allows Empty Values | `false` |
| Match | `/there is a number here: \d+/i` |

***

### `THIS_HAS_NO_DESCRIPTION`

| Config | Value |
| --- | --- |
| Name | `this-has-no-description` |
| Environment Variable | `THIS_HAS_NO_DESCRIPTION` |
| Type | `string` |
| Required | no |
| Default | `(none)` |
| Allows Empty Values | `false` |

***

