// Type definitions for @logdna/env-config
// Minimal, inferred key/value typing for configuration definitions

// Utility types to extract literal types from arrays
export type ReadonlyStringArray = readonly string[];

// Base definition interface (runtime class is untyped JS; this is a structural representation)
interface BaseDefinition<Name extends string = string, Kind extends string = string> {
  _name: Name;
  _type: Kind;
  // Chainable common methods
  required(): this;
  desc(str: string): this;
  description(str: string): this;
  default(val: any): this; // default does not change exposed type here (runtime may still allow null)
  allowEmpty(): this;
  name(str: string): this;
}

// Enum extension captures allowed values to narrow type
interface EnumCapable<Name extends string = string> extends BaseDefinition<Name, 'enum'> {
  values<V extends ReadonlyStringArray>(vals: V): EnumCapableWithValues<Name, V>;
}
interface EnumCapableWithValues<Name extends string, V extends ReadonlyStringArray> extends BaseDefinition<Name, 'enum'> {
  readonly __enumValues: V[number];
  values(vals: V): this; // further calls keep same type
}

// Regex definition
interface RegexDefinition<Name extends string = string> extends BaseDefinition<Name, 'regex'> {
  match(re: string | RegExp): this;
}

// Number definition (min/max chaining)
interface NumberDefinition<Name extends string = string> extends BaseDefinition<Name, 'number'> {
  min(n: number): this;
  max(n: number): this;
}

// Boolean definition (no special methods beyond base)
interface BooleanDefinition<Name extends string = string> extends BaseDefinition<Name, 'boolean'> {}

// String definition
interface StringDefinition<Name extends string = string> extends BaseDefinition<Name, 'string'> {}

// List definition (captures element type & separator)
interface ListDefinition<Name extends string = string, ElemKind extends ListElementKind | undefined = undefined> extends BaseDefinition<Name, 'list'> {
  type<T extends ListElementKind>(t: T): ListDefinitionWithType<Name, T>;
  separator(val: string | RegExp): this;
}
interface ListDefinitionWithType<Name extends string, ElemKind extends ListElementKind> extends BaseDefinition<Name, 'list'> {
  readonly __listType: ElemKind;
  type(t: ElemKind): this; // idempotent if called again
  separator(val: string | RegExp): this;
}

type ListElementKind = 'string' | 'number' | 'boolean';

// Aggregate union of any definition forms
export type DefinitionAny =
  | StringDefinition<string>
  | NumberDefinition<string>
  | BooleanDefinition<string>
  | RegexDefinition<string>
  | EnumCapable<string>
  | EnumCapableWithValues<string, ReadonlyStringArray>
  | ListDefinition<string>
  | ListDefinitionWithType<string, ListElementKind>;

// Infer the names from a readonly tuple of definitions
export type DefinitionNames<Defs extends readonly DefinitionAny[]> = Defs[number]['_name'];

// Find definition by name in tuple
export type FindDefinition<Defs extends readonly DefinitionAny[], N extends string> = Extract<Defs[number], { _name: N }>;

// Map definition kind (and its refinements) to a resulting value type.
// These reflect runtime behavior loosely (null for unset strings/lists, undefined for invalid booleans, etc.)
export type ValueOfDefinition<D> =
  D extends EnumCapableWithValues<any, any> ? D['__enumValues'] | null :
  D extends { _type: 'enum' } ? string | null :
  D extends { _type: 'string' } ? string | null :
  D extends { _type: 'number' } ? number :
  D extends { _type: 'boolean' } ? boolean | undefined :
  D extends { _type: 'regex' } ? string | null :
  D extends ListDefinitionWithType<any, infer E> ? (
    E extends 'string' ? string[] | null :
    E extends 'number' ? number[] | null :
    E extends 'boolean' ? (boolean | undefined)[] | null : any
  ) :
  D extends { _type: 'list' } ? any[] | null :
  unknown;

// Produce a record type for all definitions in a tuple
export type ConfigShape<Defs extends readonly DefinitionAny[]> = {
  [K in DefinitionNames<Defs>]: ValueOfDefinition<FindDefinition<Defs, K>>
};

// Main Config class declaration
declare class Config<Defs extends readonly DefinitionAny[] = DefinitionAny[]> extends Map<DefinitionNames<Defs>, any> {
  constructor(input: Defs);
  // Override get/has with key autocomplete and value typing
  get<K extends DefinitionNames<Defs>>(key: K): ConfigShape<Defs>[K];
  has<K extends DefinitionNames<Defs>>(key: K): boolean;
  toJSON(): ConfigShape<Defs>;
  validateEnvVars(): void;
  // Index signature for direct property access (REPL getter injection at runtime)
  [K in DefinitionNames<Defs>]: ConfigShape<Defs>[K];
  // Static builders (preserve name literal type)
  static string<N extends string>(name: N): StringDefinition<N>;
  static number<N extends string>(name: N): NumberDefinition<N>;
  static boolean<N extends string>(name: N): BooleanDefinition<N>;
  static regex<N extends string>(name: N): RegexDefinition<N>;
  static enum<N extends string>(name: N): EnumCapable<N>;
  static list<N extends string>(name: N): ListDefinition<N>;
  // Factory helper for JS users
  static createConfig<D extends readonly DefinitionAny[]>(defs: D): Config<D>;
}

// Standalone factory function mirroring the static (CommonJS export augmentation)
export function createConfig<D extends readonly DefinitionAny[]>(defs: D): Config<D>;

export = Config;
