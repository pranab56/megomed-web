'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdAttachFile, MdClose, MdImage } from 'react-icons/md';

const ChatWindow = ({ id }) => {
  const [formValues, setFormValues] = useState({ message: '', file: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Mock data for UI only
  const loginUserId = "user123";
  const chatUser = {
    participants: [
      { _id: "user456", name: "Alex Morgan", userName: "alexm", profile: "https://i.pravatar.cc/150?img=3" }
    ],
    isBlocked: false
  };

  const mockMessages = [
    {
      _id: "msg1",
      text: "Hey! How are you?",
      sender: { _id: "user456", userName: "alexm", profile: "https://i.pravatar.cc/150?img=3" },
      createdAt: new Date(Date.now() - 3600000),
      isDeleted: false,
      read: true
    },
    {
      _id: "msg2",
      text: "I'm good! 😊 Just working on the new design.",
      sender: { _id: "user123", userName: "you", profile: "https://i.pravatar.cc/150?img=8" },
      createdAt: new Date(Date.now() - 1800000),
      isDeleted: false,
      read: true
    },
    {
      _id: "msg3",
      images: ["https://picsum.photos/300/200"],
      sender: { _id: "user456", userName: "alexm", profile: "https://i.pravatar.cc/150?img=3" },
      createdAt: new Date(Date.now() - 600000),
      isDeleted: false,
      read: false
    }
  ];

  // Mock handlers
  const handleCreateNewMessage = () => {
    console.log("Message sent (mock):", formValues);
    setFormValues({ message: '', file: null });
    setImagePreview(null);
    setShowFileUpload(false);
    inputRef.current?.focus();
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
      }
      setFormValues({ ...formValues, file });
      setShowFileUpload(false);
    }
  };

  const removeAttachment = () => {
    setImagePreview(null);
    setFormValues({ ...formValues, file: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleReportSubmit = () => {
    console.log("Report submitted:", { reason: reportReason, message: reportMessage });
    // Reset form and close modal
    setReportReason('');
    setReportMessage('');
    setShowReportModal(false);
  };

  const handleCloseModal = () => {
    setReportReason('');
    setReportMessage('');
    setShowReportModal(false);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const toggleFileUpload = () => {
    setShowFileUpload(!showFileUpload);
  };

  if (!id) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] rounded-lg flex flex-col shadow-lg border bg-white border-gray-200">
      {/* Header */}
      {chatUser?.participants?.map(item => (
        <div key={item._id} className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={item.profile} />
                <AvatarFallback>{item.name?.charAt(0) || item.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{item.name || item.userName}</h2>
              <p className="text-sm text-green-500">Larry is Typing...</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Freelancer Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReportModal(true)}
              >
                Report
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ scrollBehavior: 'auto' }}>
        <AnimatePresence initial={false}>
          {[...mockMessages].reverse().map((message, index) => {
            const isCurrentUser = message.sender?._id === loginUserId;
            const isFirst = index === 0;

            return (
              <motion.div
                key={message._id}
                className={`relative flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isFirst ? 'mb-6 mt-1' : 'mb-6'}`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 mr-3 self-start mt-1">
                    <AvatarImage src={message.sender?.profile} />
                    <AvatarFallback>{message.sender?.userName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}

                <div className="relative group max-w-[75%]">
                  <span className={`text-xs ${isCurrentUser ? "justify-end pr-3 pb-2 flex" : "justify-start pl-3 pb-2 flex"}`}>
                    {formatDate(message.createdAt)}
                  </span>

                  <motion.div
                    className={`relative pl-4 pt-3 pr-4 pb-3 rounded-xl ${isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                      } shadow-sm`}
                  >
                    {message.images?.length > 0 && (
                      <div className="mb-3">
                        <img
                          src={message.images[0]}
                          alt="Attachment"
                          className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                        />
                      </div>
                    )}

                    {message.text && (
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    )}

                    {message.read && isCurrentUser && (
                      <div className="flex justify-end mt-1">
                        <svg className="w-4 h-4 text-white opacity-70" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                        <svg className="w-4 h-4 text-white opacity-70 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                </div>

                {isCurrentUser && (
                  <Avatar className="h-8 w-8 ml-3 self-end mt-1">
                    <AvatarImage src={message.sender?.profile} />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* File/Image Preview */}
      <AnimatePresence>
        {(imagePreview || formValues.file) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 border-t border-gray-200 bg-white"
          >
            <div className="relative inline-block">
              {imagePreview ? (
                // Image preview
                <>
                  <img src={imagePreview} alt="Preview" className="h-20 w-auto rounded-lg object-cover border-2" />
                  <button
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                    onClick={removeAttachment}
                  >
                    <MdClose size={14} />
                  </button>
                </>
              ) : formValues.file ? (
                // Document preview
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 border-2 border-dashed border-gray-300 min-w-[200px]">
                  <span className="text-2xl">{getFileIcon(formValues.file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{formValues.file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(formValues.file.size)}</p>
                  </div>
                  <button
                    className="rounded-full bg-red-500 text-white w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 flex-shrink-0"
                    onClick={removeAttachment}
                  >
                    <MdClose size={14} />
                  </button>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      {chatUser?.isBlocked ? (
        <div className="p-4 text-center bg-white text-gray-600">
          You can no longer access this conversation.
        </div>
      ) : (
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-600"
                onClick={toggleFileUpload}
              >
                <MdAttachFile size={20} />
              </Button>

              {/* File Upload Options - Now positioned relative to the button */}
              <AnimatePresence>
                {showFileUpload && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10"
                  >
                    <div className="flex flex-col space-y-2 min-w-[150px]">
                      <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'image')}
                          className="hidden"
                        />
                        <MdImage className="text-green-500" size={20} />
                        <span className="text-sm text-gray-700">Image</span>
                      </label>

                      <label className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileChange(e, 'file')}
                          className="hidden"
                        />
                        <MdAttachFile className="text-blue-500" size={20} />
                        <span className="text-sm text-gray-700">Document</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Input
              ref={inputRef}
              value={formValues.message}
              onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-gray-100 border-gray-200 focus:bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateNewMessage();
                }
              }}
            />

            <Button
              onClick={handleCreateNewMessage}
              size="icon"
              className="bg-blue-500 hover:bg-blue-600 rounded-full"
              disabled={!formValues.message.trim() && !formValues.file}
            >
              <IoMdSend className="text-white" />
            </Button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-blue-600">Report Client</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Reason
                  </label>
                  <input
                    type="text"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Write Reason"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verify Message
                  </label>
                  <div className="relative">
                    <textarea
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      placeholder="Write Message/ Send Message"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />

                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReportSubmit}
                  className="px-6 bg-blue-600 hover:bg-blue-700"
                  disabled={!reportReason.trim()}
                >
                  Report Freelancer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow;