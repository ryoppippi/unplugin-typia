import typia, { type tags } from 'typia';

const check = typia.createIs<IMember>();
type IMember = {
	email: string & tags.Format<'email'>;
	id: string & tags.Format<'uuid'>;
	age: number & tags.Type<'uint32'> & tags.ExclusiveMinimum<19> & tags.Maximum<100>;
};
const res = check({});
