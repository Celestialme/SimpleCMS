// import Address from './address';
// import Checkbox from './checkbox';
import Currency from './currency';
// import Date from './date';
// import DateRange from './dateRange';
import Email from './email';
// import Group from './group';
import ImageArray from './imageArray';
// import ImageEditor from './imageEditor';
// import ImageEditorPage from './imageEditorPage';
import ImageUpload from './imageUpload';
import MegaMenu from './megaMenu';
import Number from './number';
import PhoneNumber from './phoneNumber';
import Radio from './radio';
import Relation from './relation';
// import RemoteVideo from './remoteVideo';
// import RichText from './richText';
// import SelectList from './selectList';
import Seo from './seo';
import Text from './text';

let widgets = {
	// Address flexible Address fields
	//Address,
	// Checkbox - boolean true / false checkbox
	//Checkbox,
	// Currency - define input with a currency string and suffix
	Currency,
	// Date - date / time field that saves a timestamp
	//Date,
	// DateRange - date with start / Finish timestamps
	//DateRange,
	// Email - validates the entry is a properly formatted email
	Email,
	// Group - nest fields within an object with condition & tabs
	//Group,
	// ImageUpload - allows image upload with editor
	ImageUpload,
	// ImageArray - allows multiple image upload with editor
	ImageArray,
	// Image Editor - Crop / Blur / Rotation and Save upload to Webp
	//ImageEditor,
	//ImageEditorPage,
	// MegaMenu - Flexible Menu with possible hierarchy
	MegaMenu,
	// Number - field that enforces that its value be a number
	Number,
	// PhoneNumber - Field checking for phone/Fax numbers
	PhoneNumber,
	// Radio - radio button group, allowing only one value to be selected
	Radio,
	// Relation - assign relationships to other collections
	Relation,
	// RemoteVideo - for youtube/vimeo(/Twitch/ticktock), grabbing Title/Duration,Dimension,User
	//RemoteVideo,
	// Rich Text - fully extensible Lexical Rich Text editor
	//RichText,
	// SelectList - dropdown / pick list style value selector
	//SelectList,
	// Seo - Basic Seo Title /Description with preview
	Seo,
	// Text - simple text input
	Text
	// Textarea - allows a bit larger of a text editor
	//Textarea,
	// Upload - allows local file and image upload
	//Upload
	// Url - Link to internal / External hyperlinks
	//Url
};

export default widgets;
