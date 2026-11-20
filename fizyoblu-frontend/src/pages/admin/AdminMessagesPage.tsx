import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../services/api';
import { Mail, Check, Trash2, ArrowUpRight, X } from 'lucide-react';
import type { ContactMessage } from '../../types';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [alert, setAlert] = useState<{ text: string; error?: boolean } | null>(null);

  const loadMessages = async () => {
    try {
      const res = await api.getMessages(filterUnread ? true : undefined);
      if (res.success) setMessages(res.data);
    } catch (err: any) {
      setAlert({ text: err.message, error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filterUnread]);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await api.updateMessageStatus(msg.id, !msg.isRead);
      loadMessages();
      if (activeMessage?.id === msg.id) {
        setActiveMessage({ ...msg, isRead: !msg.isRead });
      }
    } catch (err: any) {
      setAlert({ text: err.message, error: true });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteMessage(id);
      setAlert({ text: 'Mesaj silindi.' });
      if (activeMessage?.id === id) setActiveMessage(null);
      loadMessages();
    } catch (err: any) {
      setAlert({ text: err.message, error: true });
    }
  };

  const handleView = async (msg: ContactMessage) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      await api.updateMessageStatus(msg.id, true);
      loadMessages();
    }
  };

  return (
    <AdminLayout title="İletişim Mesajları" subtitle="Web sitesi üzerinden gelen randevu ve danışma talepleri">
      {alert && (
        <div
          className={`p-3 text-xs mb-6 ${
            alert.error
              ? 'bg-[#FBE9E7] text-[#C62828] border border-[#FFCCBC]'
              : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
          }`}
        >
          {alert.text}
        </div>
      )}

      {/* Filter tab */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterUnread(false)}
            className={`px-3 py-1.5 uppercase tracking-wider ${
              !filterUnread ? 'bg-[#2B382D] text-white font-medium' : 'bg-white text-[#555] border border-[#DDD8CE]'
            }`}
          >
            Tüm Mesajlar
          </button>
          <button
            onClick={() => setFilterUnread(true)}
            className={`px-3 py-1.5 uppercase tracking-wider ${
              filterUnread ? 'bg-[#2B382D] text-white font-medium' : 'bg-white text-[#555] border border-[#DDD8CE]'
            }`}
          >
            Yalnızca Okunmamışlar
          </button>
        </div>

        <p className="text-xs text-[#736E65]">Toplam {messages.length} mesaj listeleniyor.</p>
      </div>

      {loading ? (
        <p className="text-xs text-[#736E65]">Yükleniyor...</p>
      ) : (
        <div className="bg-white border border-[#E5E0D5] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] border-b border-[#E5E0D5] text-[#6A655C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4">Gönderen</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Hizmet / Şube</th>
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE5]">
              {messages.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => handleView(m)}
                  className={`cursor-pointer transition-colors ${
                    !m.isRead ? 'bg-[#FAFBF9] font-medium' : 'hover:bg-[#FAF9F6]'
                  }`}
                >
                  <td className="py-2.5 px-4">
                    {!m.isRead ? (
                      <span className="text-[10px] bg-[#FBE9E7] text-[#C62828] px-2 py-0.5 rounded font-bold uppercase">
                        Yeni
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#A09A8F]">Okundu</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-[#1B1E1C]">
                    <p className="font-semibold">{m.fullName}</p>
                    <p className="text-[11px] text-[#7A756B]">{m.email}</p>
                  </td>
                  <td className="py-2.5 px-4 text-[#7A756B]">{m.phone}</td>
                  <td className="py-2.5 px-4 text-[#7A756B]">
                    {m.interestedService || 'Genel'}{' '}
                    {m.preferredBranch ? `(${m.preferredBranch})` : ''}
                  </td>
                  <td className="py-2.5 px-4 text-[#7A756B]">
                    {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleRead(m)}
                      className="p-1 text-[#4A5D4E] hover:text-black"
                      title={m.isRead ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1 text-[#C56868] hover:text-red-700"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-[#DDD6C8] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFECE5] pb-3">
              <h3 className="font-serif text-xl text-[#1B1E1C]">Mesaj Detayı</h3>
              <button onClick={() => setActiveMessage(null)} className="text-[#888] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#888] uppercase tracking-wider">Gönderen</p>
                  <p className="font-semibold text-sm text-[#1B1E1C]">{activeMessage.fullName}</p>
                </div>
                <div>
                  <p className="text-[#888] uppercase tracking-wider">Tarih</p>
                  <p className="text-[#444]">{new Date(activeMessage.createdAt).toLocaleString('tr-TR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#888] uppercase tracking-wider">Telefon</p>
                  <p className="font-medium text-[#1B1E1C]">{activeMessage.phone}</p>
                </div>
                <div>
                  <p className="text-[#888] uppercase tracking-wider">E-posta</p>
                  <p className="text-[#1B1E1C]">{activeMessage.email}</p>
                </div>
              </div>

              {activeMessage.interestedService && (
                <div>
                  <p className="text-[#888] uppercase tracking-wider">İlgilendiği Hizmet</p>
                  <p className="font-medium text-[#4A5D4E]">{activeMessage.interestedService}</p>
                </div>
              )}

              {activeMessage.preferredBranch && (
                <div>
                  <p className="text-[#888] uppercase tracking-wider">Tercih Edilen Şube</p>
                  <p className="text-[#444]">{activeMessage.preferredBranch}</p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-[#888] uppercase tracking-wider mb-1">Mesaj Metni</p>
                <div className="bg-[#FAF9F5] p-3 border border-[#E5E0D5] text-[#333] leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

              {/* Fast reply actions */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/${activeMessage.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#2B382D] text-[#FAF9F5] text-xs uppercase tracking-wider"
                >
                  <span>WhatsApp ile Yanıtla</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </a>

                <a
                  href={`mailto:${activeMessage.email}`}
                  className="inline-flex items-center px-4 py-2 border border-[#2B382D] text-[#2B382D] text-xs uppercase tracking-wider"
                >
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span>E-posta Gönder</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
