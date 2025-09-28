'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdAttachFile, MdClose, MdImage } from 'react-icons/md';
import { useCreateInvoiceMutation } from '../../../features/invoice/invoiceApi';

import { useCreateMessageMutation, useGetMessageByIdQuery } from '../../../features/message/messageApi';
import { useGetAllServicesQuery } from '../../../features/services/servicesApi';
import { useRunningTenderByClientIdQuery } from '../../../features/tender/tenderApi';

const ChatWindow = ({ clientId, chatId }) => {
  const [formValues, setFormValues] = useState({ message: '', file: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceType: 'tender', // tender/service
    clientUserId: clientId,
    tenderId: '',
    serviceType: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [createInvoice, { isLoading: creatingInvoiceLoading }] = useCreateInvoiceMutation();
  const { data: tenderResponse, isLoading: runningTenderLoading } = useRunningTenderByClientIdQuery(clientId, { skip: !clientId });
  const { data: serviceTypeResponse, isLoading: serviceLoading } = useGetAllServicesQuery();
  const [createMessage, { isLoading: createMessageLoading }] = useCreateMessageMutation();
  const { data: messagesResponse, isLoading: getMessageLoading, refetch: refetchMessages } = useGetMessageByIdQuery(chatId, { skip: !chatId });

  // Extract data from API responses
  const tenderData = tenderResponse?.data || [];
  const serviceData = serviceTypeResponse?.data || [];
  const messagesData = messagesResponse?.data?.newResult?.result || [];

  // Get current user ID from auth or context - you'll need to replace this with actual auth
  const loginUserId = "68b80540dcf6e82fd9335831"; // Replace with actual current user ID

  // Mock chat user data - replace with actual data from your chat/user API
  const chatUser = {
    participants: [
      { _id: "68b80540dcf6e82fd9335831", name: "Tanvir Ahmed Swapnil", userName: "tanvir", profile: "uploads\\profile\\bg-1758953796086-168458687.jpg" }
    ],
    isBlocked: false
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleCreateNewMessage = async () => {


    if (!formValues.message.trim() && !formValues.file) return;

    try {
      const formData = new FormData();

      if (formValues.message.trim()) {
        formData.append('message', formValues.message);
      }

      if (formValues.file) {
        formData.append('image', formValues.file);
      }
      formData.append('chatId', chatId);



      const result = await createMessage(formData).unwrap();
      console.log(result);

      // Reset form
      setFormValues({ message: '', file: null });
      setImagePreview(null);
      setShowFileUpload(false);
      inputRef.current?.focus();

      // Refetch messages to get the latest
      refetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
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
    setReportReason('');
    setReportMessage('');
    setShowReportModal(false);
  };

  const handleCloseModal = () => {
    setReportReason('');
    setReportMessage('');
    setShowReportModal(false);
  };

  const handleInvoiceSubmit = async () => {
    try {
      const invoiceData = {
        invoiceType: invoiceForm.invoiceType,
        clientUserId: invoiceForm.clientUserId,
        tenderId: invoiceForm.invoiceType === 'tender' ? invoiceForm.tenderId : undefined,
        serviceType: invoiceForm.serviceType,
        amount: parseFloat(invoiceForm.amount),
        date: new Date(invoiceForm.date).toISOString()
      };

      const result = await createInvoice(invoiceData).unwrap();
      console.log("Invoice created successfully:", result);

      setInvoiceForm({
        invoiceType: 'tender',
        clientUserId: clientId,
        tenderId: '',
        serviceType: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowInvoiceModal(false);

    } catch (error) {
      console.error("Failed to create invoice:", error);
    }
  };

  const handleCloseInvoiceModal = () => {
    setInvoiceForm({
      invoiceType: 'tender',
      clientUserId: clientId,
      tenderId: '',
      serviceType: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowInvoiceModal(false);
  };

  const handleInvoiceTypeChange = (type) => {
    setInvoiceForm({
      ...invoiceForm,
      invoiceType: type,
      tenderId: type === 'tender' ? invoiceForm.tenderId : '',
      serviceType: type === 'service' ? invoiceForm.serviceType : ''
    });
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Adjust this base URL according to your server setup
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
  };

  if (!clientId || !chatId) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  if (getMessageLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-[80vh] rounded-lg flex flex-col shadow-lg border bg-white border-gray-200">
        {/* Header */}
        {chatUser?.participants?.map(item => (
          <div key={item._id} className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getImageUrl(item.profile)} />
                  <AvatarFallback>{item.name?.charAt(0) || item.userName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{item.name || item.userName}</h2>
                <p className="text-sm text-green-500">Online</p>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInvoiceModal(true)}
                >
                  Create Invoice
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
          <AnimatePresence initial={false}>
            {messagesData.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              [...messagesData].reverse().map((message, index) => {
                const isCurrentUser = message.sender?._id === loginUserId;
                const isFirst = index === 0;

                return (
                  <motion.div
                    key={message._id}
                    className={`relative flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isFirst ? 'mb-6 mt-1' : 'mb-6'}`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="h-8 w-8 mr-3 self-start mt-1">
                        <AvatarImage src={getImageUrl(message.sender?.profile)} />
                        <AvatarFallback>{message.sender?.fullName?.charAt(0)}</AvatarFallback>
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
                        {message.image && (
                          <div className="mb-3">
                            <img
                              src={getImageUrl(message.image)}
                              alt="Attachment"
                              className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                            />
                          </div>
                        )}

                        {message.message && (
                          <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        )}

                        {message.seen && isCurrentUser && (
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
                        <AvatarImage src={getImageUrl(message.sender?.profile)} />
                        <AvatarFallback>{message.sender?.fullName?.charAt(0) || 'Y'}</AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                );
              })
            )}
            <div ref={messagesEndRef} />
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
                disabled={createMessageLoading}
              />

              <Button
                onClick={handleCreateNewMessage}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 rounded-full"
                disabled={(!formValues.message.trim() && !formValues.file) || createMessageLoading}
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

      {/* Create Invoice Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent className="sm:max-w-lg bg-white">
          <div className="flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="text-blue-600 text-xl font-semibold">Create New Invoice</DialogTitle>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseInvoiceModal}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="font-bold text-sm">CONLINE</div>
                <div className="w-6 h-4 border border-white rounded-sm mx-auto mt-1"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="invoice-type" className="text-sm font-medium text-gray-700">
                Invoice Type
              </Label>
              <Select
                value={invoiceForm.invoiceType}
                onValueChange={handleInvoiceTypeChange}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select Invoice Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tender">Tender</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {invoiceForm.invoiceType === 'tender' && (
              <div>
                <Label htmlFor="tender" className="text-sm font-medium text-gray-700">
                  Tender
                </Label>
                <Select
                  value={invoiceForm.tenderId}
                  onValueChange={(value) => setInvoiceForm({ ...invoiceForm, tenderId: value })}
                  disabled={runningTenderLoading}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue
                      placeholder={
                        runningTenderLoading ? "Loading tenders..." : "Select Tender"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {tenderData.map((tender) => (
                      <SelectItem key={tender._id} value={tender._id}>
                        {tender.title}
                      </SelectItem>
                    ))}
                    {tenderData.length === 0 && !runningTenderLoading && (
                      <SelectItem value="no-tender" disabled>
                        No tenders available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="service-type" className="text-sm font-medium text-gray-700">
                Service Type
              </Label>
              <Select
                value={invoiceForm.serviceType}
                onValueChange={(value) => setInvoiceForm({ ...invoiceForm, serviceType: value })}
                disabled={serviceLoading}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue
                    placeholder={
                      serviceLoading ? "Loading services..." : "Select Service Type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {serviceData.map((service) => (
                    <SelectItem key={service._id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                  {serviceData.length === 0 && !serviceLoading && (
                    <SelectItem value="no-service" disabled>
                      No services available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date
              </Label>
              <div className="relative mt-1">
                <Input
                  id="date"
                  type="date"
                  value={invoiceForm.date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, date: e.target.value })}
                  className="w-full pr-10"
                />
                <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseInvoiceModal}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvoiceSubmit}
              disabled={
                creatingInvoiceLoading ||
                !invoiceForm.amount ||
                (invoiceForm.invoiceType === 'tender' && !invoiceForm.tenderId) ||
                (invoiceForm.invoiceType === 'service' && !invoiceForm.serviceType)
              }
              className="px-8 bg-blue-600 hover:bg-blue-700"
            >
              {creatingInvoiceLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatWindow;