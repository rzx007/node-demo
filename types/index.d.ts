/* eslint-disable @typescript-eslint/no-unused-vars */

// extends
// T extends U ? X : Y
// 如果T包含的类型 是 U包含的类型的 '子集'，那么取结果X，否则取结果Y

type NonNullable<T> = T extends null | undefined ? never : T;

// 如果泛型参数 T 为 null 或 undefined，那么取 never，否则直接返回T。
let val1: NonNullable<number>; // number
const val2: NonNullable<null>; // never
const val3: NonNullable<(params: string) => number>; // (params: string) => number

// 为联合类型时, 会进行拆分操作
type Diff<T, U> = T extends U ? never : T; // 找出T的差集
type T30 = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // => "b" | "d"
// 相当于
// <'a', "a" | "c" | "f"> |
// <'b', "a" | "c" | "f"> |
// <'c', "a" | "c" | "f"> |
// <'d', "a" | "c" | "f">
let demo1: Diff<number, string>; // => number

type Filter<T, U> = T extends U ? T : never; // 找出交集
type T31 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; // => "a" | "c"
// 相当于
// <'a', "a" | "c" | "f"> |
// <'b', "a" | "c" | "f"> |
// <'c', "a" | "c" | "f"> |
// <'d', "a" | "c" | "f">
let demo2: Filter<1, number>; // => 1

// extends infer
// 在extends语句中，还支持infer关键字，可以推断一个类型变量，高效的对类型进行模式匹配。但是，这个类型变量只能在true的分支中使用。
// infer R 可以理解为一个变量

// 如果泛型变量T是 () => infer R的`子集`，那么返回 通过infer获取到的函数返回值，否则返回T
type returnType<T> = T extends (...args: any[]) => infer R ? R : T;

const a: returnType<(params: string) => number> = 1;

// 当a、b为不同类型的时候，返回不同类型的联合类型
type Obj<T> = T extends { a: infer VType; b: infer VType } ? VType : number;

let func1: Func<number>; // => boolean
let func2: Func<''>; // => boolean
let func3: Func<() => Promise<number>>; // => Promise<number>

/**
 *
 * eg：
 *  type QueryStr = 'name=kn&sex=f&language=ts'
 *
 *  ........ split 解析 .......
 *
 *  type QueryKeyValue = Split<QueryStr>
 *
 *  ........ res .........
 *
 *  type QueryKeyValue = {
 *    name: 'kn';
 *    sex: 'f';
 *    language: 'ts';
 *  }

*/
// 1. 拆解实现
// 参数转换成{key:value}
type QueryStr = 'name=rzx&sex=f&language=ts';

type Split<T> = T extends `${infer Left}&${infer Right}` ? [Left, ...Split<Right>] : [T];

const split: Split<QueryStr>; // ["name=rzx", "sex=f", "language=ts"]

type StrToKeyValue<T> = T extends `${infer K}=${infer V}` ? { [key in K]: V } : T;

const keyVaue: StrToKeyValue<'name=kn'>; // { name: 'rzx' }

type KeyValueTuple<T> = T extends [infer Item, ...infer restItems]
  ? [StrToKeyValue<Item>, ...KeyValueTuple<restItems>]
  : T;

const keyValues: KeyValueTuple<Split<QueryStr>>; // [{name: "rzx";},{sex: "f";},{language: "ts";}]

// 2.优化实现
type QueryStr = 'name=rzx&sex=f&language=ts';

type Split<T> = T extends `${infer Left}&${infer Right}` ? [Left, ...Split<Right>] : [T];

type TupleStrToIntersection<T> = T extends [`${infer Left}=${infer Right}`, ...infer Rest]
  ? { [key in Left]: Right } & TupleStrToIntersection<Rest>
  : unknown;

type QueryKeyValue = TupleStrToIntersection<Split<QueryStr>>;
