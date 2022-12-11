import Text from './text';
import Relation from './relation';
import MegaMenu from './megaMenu';
import ImageUpload from './imageUpload';
import ImageArray from './imageArray';
import Date from './date';
import DateRange from './dateRange';
import Email from './email';
import Url from './url';
import Checkbox from './checkbox';
import Radio from './radio';
import Number from './number';
import Group from './group';
import Address from './address';

let widgets = {
	/**text widget does all good stuff*/

	// Address flexible Address fields
	Address,
	// Array - for repeating content, supports nested fields
	//Array,
	// Blocks - block-based fields, allowing powerful layout creation
	//Blocks,
	// Checkbox - boolean true / false checkbox
	Checkbox,
	// Code - code editor that saves a string to the database
	//Code,
	// Collapsible - used for admin layout, nest fields within a collapsible component
	//Collapsible,
	// Date - date / time field that saves a timestamp
	Date,
	// DateRange - date with start / Finish timestamps
	DateRange,
	// Email - validates the entry is a properly formatted email
	Email,
	// Group - nest fields within an object
	Group,
	// ImageUpload - allows image upload with editor
	ImageUpload,
	// ImageArray - allows multiple image upload with editor
	ImageArray,
	// MegaMenu - Flexible Menu with possible hierachie
	MegaMenu,
	// Number - field that enforces that its value be a number
	Number,
	// Geolocation - geometric coordinates for location data
	//Geolocation,
	// Radio - radio button group, allowing only one value to be selected
	Radio,
	// Range - specific rangeslider with Values
	//Range,
	// Relation - assign relationships to other collections
	Relation,
	// Rich Text - fully extensible Lexical Rich Text editor
	// Richtext,
	// Row - used for admin field layout, no effect on data shape
	//Row,
	// Select - dropdown / picklist style value selector
	//Select,
	// Tabs
	//Tabs,
	// Text - simple text input
	Text,
	// Textarea - allows a bit larger of a text editor
	//Textarea,
	// Upload - allows local file and image upload
	//Upload
	// Url - Link to internal / External hyperlinks
	Url
};

export default widgets;
