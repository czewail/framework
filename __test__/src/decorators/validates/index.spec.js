require('../../../../src/helpers');
const Descrators = require('../../../../src/decorators/validates');
const Validators = require('../../../../src/validate/validators');

describe('validate decrators', () => {
  it('should patch passed rule with @Passed', () => {
    const options = {};
    class Example {
      @Descrators.Passed() example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.passed,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch accepted rule with @Accepted', () => {
    const options = {};
    class Example {
      @Descrators.Accepted(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.accepted,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch is rule with @Is', () => {
    const options = {};
    class Example {
      @Descrators.Is('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.is,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch required rule with @Required', () => {
    const options = {};
    class Example {
      @Descrators.Required(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.required,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch equals rule with @Equals', () => {
    const options = {};
    class Example {
      @Descrators.Equals('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.equals,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsEmpty rule with @IsEmpty', () => {
    const options = {};
    class Example {
      @Descrators.IsEmpty(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isEmpty,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNotEmpty rule with @IsNotEmpty', () => {
    const options = {};
    class Example {
      @Descrators.IsNotEmpty(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNotEmpty,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDivisibleBy rule with @IsDivisibleBy', () => {
    const options = {};
    class Example {
      @Descrators.IsDivisibleBy(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDivisibleBy,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });


  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================
  // ============================================================


  it('should patch IsPositive rule with @IsPositive', () => {
    const options = {};
    class Example {
      @Descrators.IsPositive(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isPositive,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNegative rule with @IsNegative', () => {
    const options = {};
    class Example {
      @Descrators.IsNegative(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNegative,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Min rule with @Min', () => {
    const options = {};
    class Example {
      @Descrators.Min(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.min,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Max rule with @Max', () => {
    const options = {};
    class Example {
      @Descrators.Max(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.max,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });


  it('should patch AfterDate rule with @AfterDate', () => {
    const options = {};
    class Example {
      @Descrators.AfterDate(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.afterDate,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch BeforeDate rule with @BeforeDate', () => {
    const options = {};
    class Example {
      @Descrators.BeforeDate(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.beforeDate,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBoolean rule with @IsBoolean', () => {
    const options = {};
    class Example {
      @Descrators.IsBoolean(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBoolean,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDate rule with @IsDate', () => {
    const options = {};
    class Example {
      @Descrators.IsDate(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDate,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsString rule with @IsString', () => {
    const options = {};
    class Example {
      @Descrators.IsString(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNumber rule with @IsNumber', () => {
    const options = {};
    class Example {
      @Descrators.IsNumber(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNumber,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsArray rule with @IsArray', () => {
    const options = {};
    class Example {
      @Descrators.IsArray(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isArray,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsError rule with @IsError', () => {
    const options = {};
    class Example {
      @Descrators.IsError(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isError,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFunction rule with @IsFunction', () => {
    const options = {};
    class Example {
      @Descrators.IsFunction(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFunction,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBuffer rule with @IsBuffer', () => {
    const options = {};
    class Example {
      @Descrators.IsBuffer(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBuffer,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsObject rule with @IsObject', () => {
    const options = {};
    class Example {
      @Descrators.IsObject(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isObject,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsRegExp rule with @IsRegExp', () => {
    const options = {};
    class Example {
      @Descrators.IsRegExp(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isRegExp,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsSymbol rule with @IsSymbol', () => {
    const options = {};
    class Example {
      @Descrators.IsSymbol(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isSymbol,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNullOrUndefined rule with @IsNullOrUndefined', () => {
    const options = {};
    class Example {
      @Descrators.IsNullOrUndefined(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNullOrUndefined,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNull rule with @IsNull', () => {
    const options = {};
    class Example {
      @Descrators.IsNull(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNull,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUndefined rule with @IsUndefined', () => {
    const options = {};
    class Example {
      @Descrators.IsUndefined(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUndefined,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsDateString rule with @IsDateString', () => {
    const options = {};
    class Example {
      @Descrators.IsDateString(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isDateString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBooleanString rule with @IsBooleanString', () => {
    const options = {};
    class Example {
      @Descrators.IsBooleanString(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBooleanString,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsNumberString rule with @IsNumberString', () => {
    const options = {};
    class Example {
      @Descrators.IsNumberString(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isNumberString,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Contains rule with @Contains', () => {
    const options = {};
    class Example {
      @Descrators.Contains('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.contains,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch NotContains rule with @NotContains', () => {
    const options = {};
    class Example {
      @Descrators.NotContains('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.notContains,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAlpha rule with @IsAlpha', () => {
    const options = {};
    class Example {
      @Descrators.IsAlpha('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAlpha,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAlphanumeric rule with @IsAlphanumeric', () => {
    const options = {};
    class Example {
      @Descrators.IsAlphanumeric('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAlphanumeric,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsAscii rule with @IsAscii', () => {
    const options = {};
    class Example {
      @Descrators.IsAscii(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isAscii,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBase32 rule with @IsBase32', () => {
    const options = {};
    class Example {
      @Descrators.IsBase32(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBase32,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsBase64 rule with @IsBase64', () => {
    const options = {};
    class Example {
      @Descrators.IsBase64(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isBase64,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsByteLength rule with @IsByteLength', () => {
    const options = {};
    class Example {
      @Descrators.IsByteLength('test', 'test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isByteLength,
        args: ['test', 'test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsCreditCard rule with @IsCreditCard', () => {
    const options = {};
    class Example {
      @Descrators.IsCreditCard(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isCreditCard,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsCurrency rule with @IsCurrency', () => {
    const options = {};
    class Example {
      @Descrators.IsCurrency(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isCurrency,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsEmail rule with @IsEmail', () => {
    const options = {};
    class Example {
      @Descrators.IsEmail(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isEmail,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFQDN rule with @IsFQDN', () => {
    const options = {};
    class Example {
      @Descrators.IsFQDN(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFQDN,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsFullWidth rule with @IsFullWidth', () => {
    const options = {};
    class Example {
      @Descrators.IsFullWidth(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isFullWidth,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHalfWidth rule with @IsHalfWidth', () => {
    const options = {};
    class Example {
      @Descrators.IsHalfWidth(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHalfWidth,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHexColor rule with @IsHexColor', () => {
    const options = {};
    class Example {
      @Descrators.IsHexColor(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHexColor,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsHexadecimal rule with @IsHexadecimal', () => {
    const options = {};
    class Example {
      @Descrators.IsHexadecimal(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isHexadecimal,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsIP rule with @IsIP', () => {
    const options = {};
    class Example {
      @Descrators.IsIP('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isIP,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISBN rule with @IsISBN', () => {
    const options = {};
    class Example {
      @Descrators.IsISBN('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISBN,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISSN rule with @IsISSN', () => {
    const options = {};
    class Example {
      @Descrators.IsISSN(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISSN,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISIN rule with @IsISIN', () => {
    const options = {};
    class Example {
      @Descrators.IsISIN(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISIN,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsISO8601 rule with @IsISO8601', () => {
    const options = {};
    class Example {
      @Descrators.IsISO8601(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isISO8601,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsJSON rule with @IsJSON', () => {
    const options = {};
    class Example {
      @Descrators.IsJSON(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isJSON,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsLowercase rule with @IsLowercase', () => {
    const options = {};
    class Example {
      @Descrators.IsLowercase(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isLowercase,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMobilePhone rule with @IsMobilePhone', () => {
    const options = {};
    class Example {
      @Descrators.IsMobilePhone('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMobilePhone,
        args: ['test', options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMongoId rule with @IsMongoId', () => {
    const options = {};
    class Example {
      @Descrators.IsMongoId(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMongoId,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsMultibyte rule with @IsMultibyte', () => {
    const options = {};
    class Example {
      @Descrators.IsMultibyte(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isMultibyte,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsSurrogatePair rule with @IsSurrogatePair', () => {
    const options = {};
    class Example {
      @Descrators.IsSurrogatePair(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isSurrogatePair,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsURL rule with @IsURL', () => {
    const options = {};
    class Example {
      @Descrators.IsURL(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isURL,
        args: [options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUUID rule with @IsUUID', () => {
    const options = {};
    class Example {
      @Descrators.IsUUID('test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUUID,
        args: ['test'],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch IsUppercase rule with @IsUppercase', () => {
    const options = {};
    class Example {
      @Descrators.IsUppercase(options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.isUppercase,
        args: [],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch Length rule with @Length', () => {
    const options = {};
    class Example {
      @Descrators.Length(1, 10, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.length,
        args: [1, 10],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });

  it('should patch MinLength rule with @MinLength', () => {
    const options = {};
    class Example {
      @Descrators.MinLength(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.minLength,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
  it('should patch MaxLength rule with @MaxLength', () => {
    const options = {};
    class Example {
      @Descrators.MaxLength(1, options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.maxLength,
        args: [1],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
  it('should patch Matches rule with @Matches', () => {
    const options = {};
    class Example {
      @Descrators.Matches('test', 'test', options) example;
    }
    expect(Reflect.getMetadata('rules', Example.prototype)).toEqual([
      {
        field: 'example',
        handler: Validators.matches,
        args: ['test', 'test', options],
        options: {
          message: expect.any(String),
          ...options,
        },
      },
    ]);
  });
});
