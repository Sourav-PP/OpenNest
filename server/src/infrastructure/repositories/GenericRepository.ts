import { Document, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

export class GenericRepository<T extends { id?: string }, D extends Document & { _id: Types.ObjectId }> {
    private _model: Model<D>;

    constructor(model: Model<D>) {
        this._model = model;
    }

    protected map(doc: D): T {
        const obj: any = doc.toObject({ flattenMaps: true });

        const convertObjectIdToString = (value: any): any => {
            if (value instanceof Types.ObjectId) {
                return value.toString();
            }
            if (Array.isArray(value)) {
                return value.map(convertObjectIdToString);
            }
            if (value && typeof value === 'object') {
                for (const k in value) {
                    value[k] = convertObjectIdToString(value[k]);
                }
            }
            return value;
        };

        const mappedObj = convertObjectIdToString(obj);
        mappedObj.id = doc._id.toString();
        return mappedObj as T;
    }

    async findById(id: string): Promise<T | null> {
        const doc = await this._model.findById(id);
        if (!doc) return null;
        return this.map(doc);
    }

    async findOne(
        filter: FilterQuery<D>,
        select?: string,
    ): Promise<T | null> {
        const doc = await this._model.findOne(filter).select(select || '');
        if (!doc) return null;
        return this.map(doc);
    }

    async findAll(filter: FilterQuery<D> = {}): Promise<T[]> {
        const docs = await this._model.find(filter);
        return docs.map(doc => this.map(doc));
    }

    async create(data: Omit<T, 'id'>): Promise<T> {
        console.log('create: ', data);
        const doc = await this._model.create(data);
        return this.map(doc);
    }

    async updateById(id: string, data: Partial<Omit<T, 'id'>>): Promise<T | null> {
        const doc = await this._model.findByIdAndUpdate(
            id,
            data as UpdateQuery<D>,
            { new: true },
        );
        if (!doc) return null;
        return this.map(doc);
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await this._model.findByIdAndDelete(id);
        return !!result;
    }
}
