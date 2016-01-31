var keystone = require('keystone'),
	Types = keystone.Field.Types,
	nunjucksFilters = require('nunjucks/src/filters');

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	thumbnailImage: { type: Types.CloudinaryImage, autoCleanup: true, folder: 'posts' },
	images: { type: Types.CloudinaryImages, folder: 'posts' },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	searchContent: { type: Types.Text, hidden: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Post.schema.index({
    title: 'text',
    searchContent: 'text'
}, {
    name: 'searchIndex',
    weights: {
        searchContent: 2,
        title: 1
    }
});

Post.schema.virtual('thumbnailExists').get(function() {
    return this.thumbnailImage.exists;
});

Post.schema.pre('validate', function(next) {
	if (this.thumbnailExists) {
        if (this.thumbnailImage.width !== 80 && this.thumbnailImage.height !== 80) {
            next(Error('Thumbnail image must be 80x80 pixels.'));
        }
    }

	// Convert the HTML content to plain text for searching
    this.searchContent = nunjucksFilters.striptags(this.content.extended);

	next();
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
