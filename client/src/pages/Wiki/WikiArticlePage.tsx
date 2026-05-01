import React from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../../utils/trpc';

const WikiArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // In the future, this will fetch the MDX content
  // For now, we show the established shastric content structure
  return (
    <article className="prose prose-slate max-w-none">
      <div className="mb-8 text-center">
        <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">Root Source</span>
        <h1 className="text-5xl font-black text-slate-900 mt-2 mb-4">Sri Krishna</h1>
        <p className="text-xl text-slate-500 italic">The Absolute Source of All Knowledge</p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-xl">
        <p className="text-lg font-sanskrit leading-relaxed text-slate-800">
          सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च ।<br/>
          वेदैश्च सर्वैर्हमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् ॥
        </p>
        <p className="mt-4 text-sm text-slate-600 font-medium">
          — Bhagavad Gita 15.15
        </p>
      </div>

      <section className="mt-12 space-y-6 text-slate-700 leading-relaxed text-lg">
        <p>
          Śrī Kṛṣṇa is established as the absolute source of all Vedic literature and the ultimate Personality of Godhead through direct statements in the Vedas and the Bhagavad Gita.
        </p>
        <p>
          The Vedas are **apauruṣeya** (not of human origin) and emanate directly from the breathing of the Supreme Lord. As the literary incarnation Sage Vyāsadeva, Kṛṣṇa compiled and divided the single Veda to make it accessible to all.
        </p>
      </section>
    </article>
  );
};

export default WikiArticlePage;
