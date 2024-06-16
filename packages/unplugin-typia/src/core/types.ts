import type { Tagged, UnwrapTagged } from 'type-fest';

export type CacheKey = Tagged<string, 'cache-key'>;
export type CachePath = Tagged<string, 'cache-path'>;
export type ID = Tagged<string, 'id'>;
export type Source = Tagged<string, 'source'>;
export type FilePath = Tagged<string, 'file-path'>;

export function wrap<T extends Tagged<PropertyKey, any>>(value: UnwrapTagged<T>): T {
	return value as T;
}

export function unwrap<T extends Tagged<PropertyKey, any>>(value: T): UnwrapTagged<T> {
	return value as UnwrapTagged<T>;
}
