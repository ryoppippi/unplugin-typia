import type {IMember} from '@/type.d.ts';
import typia from 'typia';

const is = typia.createIs<IMember>();
const random = typia.createRandom<IMember>();
const validate = typia.createValidate<IMember>();

is({});
validate({});
random()
